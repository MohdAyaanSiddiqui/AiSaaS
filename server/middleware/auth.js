export const auth = async (req, res, next) => {
    try {
        const { userId } = await req.auth();
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }
        req.plan = 'free';
        req.free_usage = 0;
        next();
    } catch (error) {
        res.json({ success: false, message: 'Authentication failed', error: error.message });
    }
}