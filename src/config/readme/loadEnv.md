# loadEnv.js Documentation

## 1. File Overview

The environment loader searches for a `.env` file across several possible application locations and loads the first existing file using:

```text
dotenv
```

---

# 2. Dependencies

The module uses:

```text
fs
path
dotenv
```

for:

```text
File existence checking
Path resolution
Environment variable loading
```

---

# 3. Environment Candidates

The module checks the following candidate locations in order:

```text
project-level .env
parent-level .env
backend .env
current working directory .env
current working directory backend/.env
```

The paths are constructed using:

```text
path.resolve()
```

---

# 4. Candidate Search

For every candidate path:

```text
fs.existsSync(envPath)
```

checks whether the file exists.

---

# 5. First Existing Environment File

When an existing `.env` file is found:

```text
dotenv.config({
  path: envPath
})
```

loads its variables.

The loop then stops using:

```text
break
```

Therefore only the first matching environment file is loaded.

---

# 6. No Environment File

If none of the candidates exists, no explicit error is thrown by this module.

The application continues without loading an additional `.env` file.

Existing process environment variables remain available.

---

# 7. Complete Flow

```text
Start
  ↓
Build Environment Candidates
  ↓
Check First Path
  ↓
Exists?
 ├── Yes → dotenv.config() → Stop
 └── No  → Check Next Path
                ↓
             Repeat
```

---

# 8. Summary

`loadEnv.js` provides flexible environment-file loading across multiple project layouts. It checks several `.env` candidates in a defined order, loads the first existing file using `dotenv`, and stops searching immediately after a successful match.
