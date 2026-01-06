// Simplified auth middleware: require a signed-in user (via Clerk) and skip any plan checks.
export const auth = async (req, res, next) => {
    try {
        const { userId } = await req.auth();
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }
        // No plan/free-usage logic anymore; everything is unlocked.
        req.plan = 'free';
        req.free_usage = 0;
        next();
    } catch (error) {
        res.json({ success: false, message: 'Authentication failed', error: error.message });
    }
}