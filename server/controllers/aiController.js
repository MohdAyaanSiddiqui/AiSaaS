import OpenAI from "openai"
import sql from "../configs/db.js";
import { v2 as cloudinary } from "cloudinary";

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

        res.json({ success: true, message:"Blog Generated Successfully..." ,content:content })
    
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
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
            message:"Remove Background SuccessFully..."    
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
            message: "Remove Object Successfully..."
         })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

