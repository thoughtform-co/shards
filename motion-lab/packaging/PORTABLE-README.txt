MOTION LAB AE-LITE - AGENT-READY PORTABLE RELEASE

NORMAL EDITING
1. Extract the entire ZIP to a normal writable folder.
2. Run "Start Motion Lab" for your operating system.
3. The editor opens at http://localhost:3210.
4. Keep the launcher window open while editing.

WORKING WITH CODEX, CLAUDE CODE, OR CURSOR
1. Open this extracted folder in the agent.
2. Ask it to read AGENTS.md before making changes.
3. Use the Agent tab in Motion Lab to copy the active path and starter prompt.
4. Video edits happen in workspace/project.motion.json and synchronize automatically.
5. For editor source changes, stop the normal launcher and run "Agent Dev" instead.

The first Agent Dev launch needs internet access to install the locked development
dependencies. Normal editing does not require npm install or a system Node.js.

The first MP4 render may download Remotion's browser runtime. AI generation needs a
user-created .env.local based on .env.example. No API key is included in this release.

MACOS
This is an unsigned portable build. If Gatekeeper blocks it, right-click the .command
file, choose Open, and confirm. If necessary, run:
  xattr -dr com.apple.quarantine <extracted-folder>
