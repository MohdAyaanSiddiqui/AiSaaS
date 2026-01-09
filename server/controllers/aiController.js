import OpenAI from "openai"
import sql from "../configs/db.js";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import FormData from "form-data";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});


export const generateArticle = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { prompt, length } = req.body;


        const response = await AI.chat.completions.create({
            model: "gemini-2.5-flash",
            messages: [{
                role: "user",
                content: prompt,
            },
            ],
            temperature: 0.7,
            max_tokens: length,
        });

        const content = response.choices[0].message.content

        await sql` INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'article');`;


        res.json({
            success: true,
            message: "Article generated successfully",
            content: content,
        });

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

export const generateBlogTitle = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { prompt } = req.body;

        const response = await AI.chat.completions.create({
            model: "gemini-2.5-flash",
            messages: [{
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens: 700,
        });

        const content = response.choices[0].message.content?.trim();

        if(!content){
            return res.status(400).json({
                success:false,
                message: "Ai Returned Empty Blog title"
            })
        }

        await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'blog-title')`;

        res.json({ success: true, message:"Blog Generated Successfully" ,content:content })
    
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}


export const generateImage = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const { prompt, publish } = req.body;
        
        const formData = new FormData()
        formData.append('prompt', prompt);
        
        const { data } = await axios.post("https://clipdrop-api.co/text-to-image/v1", formData, {
            headers: {'x-api-key': process.env.CLIPDROP_API_KEY, },
            responseType: "arraybuffer",
        })

        const base64Image = `data:image/png;base64,${Buffer.from(data).toString('base64')}`;

        const { secure_url } = await cloudinary.uploader.upload(base64Image,{
        resource_type: "image"
        })

        await sql`INSERT INTO creations (user_id, prompt, content, type, publish) VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})`;

        res.json({
             success: true, 
             content: secure_url, 
             message:"Image Generated Successfully" 
        });

    } catch (error) {
        console.error(error.message)
        res.status(500).json({ success: false, message: error.message })
    }
}

export const removeImageBackground = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const image = req.file;
         
        const { secure_url } = await cloudinary.uploader.upload(image.path, {
            transformation: [
                {
                    effect: 'background_removal',
                    background_removal: 'remove_the_background'
                }
            ]
        })

        await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId},'Remove background from image', ${secure_url}, 'image')`;

        res.json({ 
            success: true, 
            content: secure_url, 
            message:"Remove Background Successfully"    
        });

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

export const removeImageObject = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const { object } = req.body;
        const image = req.file;

        const { public_id } = await cloudinary.uploader.upload(image.path)

        const imageUrl = cloudinary.url(public_id, {
            transformation: [{ effect: `gen_remove:${object}` }],
            resource_type: 'image'
        })

        await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId},${`Remove ${object} from image `}, ${imageUrl}, 'image')`;

        res.json({ 
            success: true, 
            content: imageUrl,
            message: "Remove Object Successfully"
         })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

export const resumeReview = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const resume = req.file;

        if (resume.size > 5 * 1024 * 1024) {
            return res.json({ success: false, message: "Resume File Size Exceeds allowed size (5MB)." })
        }

        const dataBuffer = fs.readFileSync(resume.path);
        const pdfData = await pdfParse(dataBuffer);

        const prompt = `Review the following resume and provide constructive feedback on its strengths, weakness, and areas for improvement. Resume Content:\n\n${pdfData.text}`
        
        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [{ 
                role: "user",
                content: prompt, 
            },],
            temperature: 0.7,
            max_tokens: 1000
        });
        const content = response.choices[0].message.content
        
        await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId},'Review The Uploaded Resume', ${content}, 'resume-review')
        `;

        res.json({ 
            success: true, 
            content,
            message:"Review Resume Successfully" })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}
