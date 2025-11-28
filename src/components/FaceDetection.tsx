"use client";
import { useEffect, useRef, useState } from "react";
import { FaceDetector, FilesetResolver } from "@mediapipe/tasks-vision";

export default function FaceDetection() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isActive, setIsActive] = useState(false);
    const [faceCount, setFaceCount] = useState(0);
    const detectorRef = useRef<FaceDetector | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (videoRef.current?.srcObject) {
                const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, []);

    const initializeDetector = async () => {
        const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        const detector = await FaceDetector.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
                delegate: "GPU"
            },
            runningMode: "VIDEO"
        });
        detectorRef.current = detector;
    };

    const startCamera = async () => {
        try {
            if (!detectorRef.current) {
                await initializeDetector();
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480 }
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current?.play();
                    setIsActive(true);
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
        setFaceCount(0);
    };

    const detectFaces = () => {
        if (!videoRef.current || !canvasRef.current || !detectorRef.current) {
            return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (!ctx || video.readyState !== 4) {
            animationFrameRef.current = requestAnimationFrame(detectFaces);
            return;
        }

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw video frame first
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Then detect and draw boxes
        const startTimeMs = performance.now();
        const detections = detectorRef.current.detectForVideo(video, startTimeMs);

        setFaceCount(detections.detections.length);

        detections.detections.forEach((detection) => {
            const box = detection.boundingBox;
            if (box) {
                ctx.strokeStyle = "#00FF00";
                ctx.lineWidth = 3;
                ctx.strokeRect(box.originX, box.originY, box.width, box.height);
            }
        });

        // Continue the loop
        animationFrameRef.current = requestAnimationFrame(detectFaces);
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative">
                <video ref={videoRef} className="hidden" />
                <canvas
                    ref={canvasRef}
                    className="rounded-lg border border-gray-700 max-w-full"
                    style={{ maxHeight: "400px" }}
                />
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={isActive ? stopCamera : startCamera}
                    className={`px-4 py-2 rounded-md transition-colors ${isActive ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    {isActive ? "Stop Camera" : "Start Face Detection"}
                </button>
                {isActive && (
                    <span className="text-green-400 font-semibold">
                        Detected faces: {faceCount}
                    </span>
                )}
            </div>
        </div>
    );
}
