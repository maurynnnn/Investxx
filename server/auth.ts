import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";
import { nanoid } from "nanoid";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function generateReferralCode() {
  return nanoid(8);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "investx-secret-key",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Verificar se existe o usuário admin
  const configureAdminUser = async () => {
    try {
      const adminUser = await storage.getUserByEmail("admin123@gmail.com");
      
      if (!adminUser) {
        // Criar o usuário admin padrão se não existir
        await storage.createUser({
          email: "admin123@gmail.com",
          username: "admin123",
          firstName: "Admin",
          lastName: "Sistema",
          password: await hashPassword("admin123"),
          role: "admin",
          referralCode: generateReferralCode()
        });
        console.log("Usuário administrador criado com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao configurar usuário administrador:", error);
    }
  };
  
  // Chamar a função para configurar o usuário admin
  configureAdminUser();

  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await storage.getUserByEmail(email);
          if (!user || !(await comparePasswords(password, user.password))) {
            return done(null, false);
          } else {
            // Update last login
            await storage.updateUserLastLogin(user.id);
            return done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      },
    ),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const { email, username, firstName, lastName, password, referredBy } = req.body;
      
      // Check if email or username already exists
      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      const existingUsername = await storage.getUserByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Create the user with a referral code
      const referralCode = generateReferralCode();
      
      const user = await storage.createUser({
        email,
        username,
        firstName,
        lastName,
        password: await hashPassword(password),
        referredBy: referredBy ? parseInt(referredBy) : undefined,
        referralCode,
      });

      // If there's a valid referral, create the referral relationship
      if (referredBy) {
        const referrer = await storage.getUser(referredBy);
        if (referrer) {
          await storage.createReferral({
            referrerId: referrer.id,
            referredId: user.id,
          });
        }
      }

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.status(200).json(req.user);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}
