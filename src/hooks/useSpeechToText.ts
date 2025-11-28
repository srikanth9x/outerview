import { useState, useEffect, useRef } from 'react';

export const useSpeechToText = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);
    const recognitionRef = useRef<any>(null);
    const finalTranscriptRef = useRef<string>('');
    const [hasRecognition, setHasRecognition] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

            if (SpeechRecognition) {
                setHasRecognition(true);
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = true;
                recognitionRef.current.interimResults = true;
                recognitionRef.current.lang = 'en-US';

                recognitionRef.current.onresult = (event: any) => {
                    console.log('Speech result received');
                    let interimTranscript = '';

                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        const transcriptPiece = event.results[i][0].transcript;
                        if (event.results[i].isFinal) {
                            finalTranscriptRef.current += transcriptPiece + ' ';
                        } else {
                            interimTranscript += transcriptPiece;
                        }
                    }

                    const fullTranscript = finalTranscriptRef.current + interimTranscript;
                    console.log('Transcript:', fullTranscript);
                    setTranscript(fullTranscript);
                };

                recognitionRef.current.onstart = () => {
                    console.log('Speech recognition started');
                };

                recognitionRef.current.onerror = (event: any) => {
                    console.error('Speech recognition error:', event.error);

                    if (event.error === 'not-allowed') {
                        setError('Microphone access denied. Please allow microphone access in your browser settings.');
                    } else if (event.error === 'no-speech') {
                        setError('No speech detected. Please try again.');
                    } else if (event.error === 'network') {
                        setError('Network error. Please check your internet connection.');
                    } else {
                        setError(`Speech recognition error: ${event.error}`);
                    }

                    setIsListening(false);
                };

                recognitionRef.current.onend = () => {
                    console.log('Speech recognition ended');
                    setIsListening(false);
                };
            } else {
                setHasRecognition(false);
            }
        }
    }, []);

    const startListening = () => {
        if (isListening) return;
        if (recognitionRef.current) {
            try {
                setError(null);
                recognitionRef.current.start();
                setIsListening(true);
            } catch (err: any) {
                if (err.name === 'InvalidStateError' || err.message?.includes('already started')) {
                    setIsListening(true);
                } else {
                    console.error('Error starting recognition:', err);
                    setError('Failed to start recording. Please try again.');
                }
            }
        } else {
            setError('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    };

    const resetTranscript = () => {
        finalTranscriptRef.current = '';
        setTranscript('');
        setError(null);
    };

    return {
        isListening,
        transcript,
        error,
        startListening,
        stopListening,
        resetTranscript,
        hasRecognition
    };
};
