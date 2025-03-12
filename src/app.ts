import express, { Application, NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import cors from "cors";
import GlobalErrorHandler from "./app/middlewares/globalErrorHandler";
import { PrismaClient } from "@prisma/client";
import router from "./app/routes";
import axios from "axios";

const app: Application = express();
const prisma = new PrismaClient();

// Middleware setup
prisma
  .$connect()
  .then(() => {
    console.log("Database connected successfully!");
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  });

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Route handler for root endpoint
app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "Welcome to api main route",
  });
});
// app.get("/quranAudio", async (req: Request, res: Response) => {
//   try {
//     // Fetch data from external Quran audio API
//     const response = await axios.get(
//       "http://api.alquran.cloud/v1/quran/ar.alafasy"    );

//     const audioData = response.data;
//     res.send({
//       message: "Welcome to API main route",
//       audioData: audioData.data.surahs, 
//     });
//   } catch (error) {    
//     res.status(500).send({
//       message: "Error fetching Quran audio",
//       error: "something went wrong",
//     });
//   }
// });

// Router setup
app.use("/api/v1", router);

app.get("/quranAudio", async (req: Request, res: Response) => {
  try { 
    const response = await axios.get("http://api.alquran.cloud/v1/quran/ar.alafasy"); 
    const surahs = response.data.data.surahs;
       
    const processedSurahs = surahs.map((surah: any) => {
      return {
        surah_number: surah.number,
        surah_name: surah.name,
        ayahs: surah.ayahs.map((ayah: any) => {
          return {
            ayah_number: ayah.number,
            audio_link: ayah.audio,
          };
        })
      };
    });
    
    res.send({   
      audioData: processedSurahs,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error fetching Quran audio",
      error: "something went wrong",
    });
  }
});

// Global Error Handler
app.use(GlobalErrorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API NOT FOUND!",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found!",
    },
  });
});

export default app;
