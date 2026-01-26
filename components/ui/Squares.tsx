"use client";
import { useRef, useEffect, useState } from "react";

interface SquaresProps {
    direction?: "diagonal" | "up" | "right" | "down" | "left";
    speed?: number;
    borderColor?: string;
    squareSize?: number;
    hoverFillColor?: string;
    className?: string;
}

export function Squares({
    direction = "diagonal",
    speed = 0.5,
    borderColor = "#333",
    squareSize = 40,
    hoverFillColor = "#222",
    className,
}: SquaresProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number | undefined>(undefined);
    const numSquaresX = useRef<number | undefined>(undefined);
    const numSquaresY = useRef<number | undefined>(undefined);
    const gridOffset = useRef({ x: 0, y: 0 });
    const [hoveredSquare, setHoveredSquare] = useState<{ x: number; y: number } | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            numSquaresX.current = Math.ceil(canvas.width / squareSize) + 1;
            numSquaresY.current = Math.ceil(canvas.height / squareSize) + 1;
        };
        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        const drawGrid = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
            const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;
            ctx.lineWidth = 0.5; // Keep lines subtle

            for (let x = startX; x < canvas.width + squareSize; x += squareSize) {
                for (let y = startY; y < canvas.height + squareSize; y += squareSize) {
                    const squareX = x - (gridOffset.current.x % squareSize);
                    const squareY = y - (gridOffset.current.y % squareSize);

                    if (
                        hoveredSquare &&
                        Math.floor((x - startX) / squareSize) === hoveredSquare.x &&
                        Math.floor((y - startY) / squareSize) === hoveredSquare.y
                    ) {
                        ctx.fillStyle = hoverFillColor;
                        ctx.fillRect(squareX, squareY, squareSize, squareSize);
                    }

                    ctx.strokeStyle = borderColor;
                    ctx.strokeRect(squareX, squareY, squareSize, squareSize);
                }
            }

            // Move grid
            const moveSpeed = speed;
            if (direction === "right") gridOffset.current.x -= moveSpeed;
            if (direction === "left") gridOffset.current.x += moveSpeed;
            if (direction === "down") gridOffset.current.y -= moveSpeed;
            if (direction === "up") gridOffset.current.y += moveSpeed;
            if (direction === "diagonal") {
                gridOffset.current.x -= moveSpeed;
                gridOffset.current.y -= moveSpeed;
            }

            requestRef.current = requestAnimationFrame(drawGrid);
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
            const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;
            const hoveredX = Math.floor((x + (gridOffset.current.x % squareSize)) / squareSize);
            const hoveredY = Math.floor((y + (gridOffset.current.y % squareSize)) / squareSize);
            setHoveredSquare({ x: hoveredX, y: hoveredY });
        };

        const handleMouseLeave = () => setHoveredSquare(null);

        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mouseleave", handleMouseLeave);
        requestRef.current = requestAnimationFrame(drawGrid);

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            canvas.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [direction, speed, borderColor, hoverFillColor, hoveredSquare, squareSize]);

    return <canvas ref={canvasRef} className={`w-full h-full border-none block ${className}`} />;
}
