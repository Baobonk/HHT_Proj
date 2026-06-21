"use client";
import zoomPlugin from 'chartjs-plugin-zoom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
    BarElement,
  BubbleController,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
ChartJS.register(zoomPlugin);
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
   BarElement, 
  BubbleController,
  ArcElement,
  Tooltip,
  Legend
);
