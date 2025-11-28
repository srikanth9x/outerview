"use client";
import { useEffect, useRef, useState } from "react";
import * as faceapi from 'face-api.js';

export default function FaceDetection() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isActive, setIsActive] = useState(false);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [confidenceScore, setConfidenceScore] = useState(0);
    const [feedback, setFeedback] = useState<string[]>([]);
    const animationFrameRef = useRef<number | null>(null);

    // Stability tracking
    const noseHistoryRef = useRef<{ x: number, y: number }[]>([]);
    const MAX_HISTORY = 30; // approx 1 second at 30fps

    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';
            try {
                console.log("Loading models from:", MODEL_URL);
                // Load Tiny Face Detector for better real-time performance
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
                ]);
                console.log("Models loaded successfully");
                setModelsLoaded(true);
            } catch (error) {
                console.error("Error loading models:", error);
            }
        };
        loadModels();

        return () => {
            stopCamera();
        };
    }, []);

    useEffect(() => {
        if (modelsLoaded && !isActive) {
            startCamera();
        }
    }, [modelsLoaded]);

    const startCamera = async () => {
        try {
            console.log("Starting camera...");
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480 }
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current?.play();
                    setIsActive(true);
                    console.log("Camera started, detecting faces...");
                    detectFaces();
                };
            }
        } catch (error) {
            console.error("Error accessing camera:", error);
        }
    };

    const stopCamera = () => {
        if (videoRef.current?.srcObject) {
            const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        setIsActive(false);
    };

    const calculateEmotionScore = (expressions: faceapi.FaceExpressions) => {
        let score = 0;
        // Positive emotions
        score += expressions.happy * 100;
        score += expressions.neutral * 80;
        score += expressions.surprised * 60;

        // Negative emotions (reduce confidence)
        score -= expressions.sad * 20;
        score -= expressions.fearful * 40;
        score -= expressions.angry * 30;
        score -= expressions.disgusted * 30;

        return Math.min(Math.max(score, 0), 100);
    };

    const calculateAttentionScore = (landmarks: faceapi.FaceLandmarks68) => {
        const nose = landmarks.getNose()[3]; // Tip of the nose
        const leftEye = landmarks.getLeftEye()[0];
        const rightEye = landmarks.getRightEye()[3];

        // Calculate face center roughly between eyes
        const eyeCenterX = (leftEye.x + rightEye.x) / 2;

        // Horizontal deviation
        const deviationX = Math.abs(nose.x - eyeCenterX);
        const faceWidth = Math.abs(rightEye.x - leftEye.x) * 2; // Approx face width

        // If nose is too far from center, user is looking away
        const normalizedDeviation = deviationX / faceWidth;

        if (normalizedDeviation < 0.15) return 100; // Looking straight
        if (normalizedDeviation < 0.25) return 60;  // Slightly turned
        return 20; // Looking away
    };

    const calculateStabilityScore = (landmarks: faceapi.FaceLandmarks68) => {
        const nose = landmarks.getNose()[3];

        noseHistoryRef.current.push({ x: nose.x, y: nose.y });
        if (noseHistoryRef.current.length > MAX_HISTORY) {
            noseHistoryRef.current.shift();
        }

        if (noseHistoryRef.current.length < 5) return 100;

        // Calculate variance
        let sumX = 0, sumY = 0;
        noseHistoryRef.current.forEach(p => { sumX += p.x; sumY += p.y; });
        const meanX = sumX / noseHistoryRef.current.length;
        const meanY = sumY / noseHistoryRef.current.length;

        let variance = 0;
        noseHistoryRef.current.forEach(p => {
            variance += Math.pow(p.x - meanX, 2) + Math.pow(p.y - meanY, 2);
        });

        const movement = Math.sqrt(variance / noseHistoryRef.current.length);

        // Lower movement is better (more stable)
        // Thresholds: < 2 very stable, < 5 normal, > 10 fidgeting
        if (movement < 2) return 100;
        if (movement < 5) return 80;
        if (movement < 10) return 50;
        return 20;
    };

    const detectFaces = async () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (video.paused || video.ended) return;

        // Ensure video is ready
        if (video.readyState < 2) {
            console.log("Video not ready yet, waiting...");
            animationFrameRef.current = requestAnimationFrame(detectFaces);
            return;
        }

        const displaySize = { width: video.videoWidth, height: video.videoHeight };
        console.log("Video dimensions:", displaySize);
        faceapi.matchDimensions(canvas, displaySize);

        try {
            // Use TinyFaceDetectorOptions
            console.log("Detecting...");
            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceExpressions();

            console.log("Detections found:", detections.length);

            const resizedDetections = faceapi.resizeResults(detections, displaySize);

            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                faceapi.draw.drawDetections(canvas, resizedDetections);
                faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

                if (detections.length > 0) {
                    const detection = detections[0];
                    const emotionScore = calculateEmotionScore(detection.expressions);
                    const attentionScore = calculateAttentionScore(detection.landmarks);
                    const stabilityScore = calculateStabilityScore(detection.landmarks);

                    console.log("Scores:", { emotionScore, attentionScore, stabilityScore });

                    // Weighted Composite Score
                    const totalScore = (emotionScore * 0.4) + (attentionScore * 0.3) + (stabilityScore * 0.3);
                    console.log("Total score:", totalScore);

                    setConfidenceScore(prev => Math.round(prev * 0.9 + totalScore * 0.1));

                    // Generate Feedback
                    const newFeedback = [];
                    if (emotionScore > 70) newFeedback.push("Positive Expression");
                    else if (emotionScore < 40) newFeedback.push("Try to Smile");

                    if (attentionScore > 80) newFeedback.push("Good Eye Contact");
                    else if (attentionScore < 50) newFeedback.push("Look at Camera");

                    if (stabilityScore > 70) newFeedback.push("Stable Posture");
                    else if (stabilityScore < 40) newFeedback.push("Reduce Movement");

                    setFeedback(newFeedback);
                } else {
                    console.log("No face detected in this frame");
                    setFeedback(["No face detected"]);
                    setConfidenceScore(0);
                }
            }
        } catch (error) {
            console.error("Detection error:", error);
        }

        animationFrameRef.current = requestAnimationFrame(detectFaces);
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-400";
        if (score >= 50) return "text-yellow-400";
        return "text-red-400";
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden rounded-xl">
            {!modelsLoaded && (
                <div className="absolute inset-0 flex items-center justify-center z-20 bg-gray-900 text-white">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p>Loading AI Models...</p>
                    </div>
                </div>
            )}

            <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="absolute w-full h-full object-cover transform scale-x-[-1]"
            />
            <canvas
                ref={canvasRef}
                className="absolute w-full h-full object-cover transform scale-x-[-1]"
            />

            {/* Confidence & Feedback Overlay */}
            {isActive && (
                <div className="absolute top-4 left-4 z-10 bg-black/70 backdrop-blur-md p-4 rounded-xl border border-gray-700/50 shadow-xl min-w-[200px]">
                    <div className="text-xs text-gray-400 mb-1 uppercase tracking-wider font-semibold">Confidence Level</div>
                    <div className={`text-4xl font-bold ${getScoreColor(confidenceScore)} mb-3`}>
                        {confidenceScore}%
                    </div>

                    <div className="space-y-1">
                        {feedback.map((item, index) => (
                            <div key={index} className="flex items-center gap-2 text-xs text-gray-300">
                                <span className={`w-1.5 h-1.5 rounded-full ${item.includes("Good") || item.includes("Positive") || item.includes("Stable")
                                    ? "bg-green-500"
                                    : "bg-yellow-500"
                                    }`}></span>
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Debug Overlay */}
            {isActive && (
                <div className="absolute top-4 right-4 z-10 bg-black/50 p-2 rounded text-xs text-green-400 font-mono">
                    <p>Debug Info:</p>
                    <p>Score: {confidenceScore}</p>
                </div>
            )}
        </div>
    );
}
