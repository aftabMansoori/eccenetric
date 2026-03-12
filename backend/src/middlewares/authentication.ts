import { Request, Response, NextFunction } from "express";

import { supabase } from "../utils/SupaBase.util.js";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    // Use Supabase to verify the token and get user data
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }

    // Attach user to the request object for use in controllers
    req.user = user;
    next();
};