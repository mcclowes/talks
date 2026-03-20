#!/bin/bash
# Rotate Claude Code logs and debug files
# Run periodically: crontab -e → 0 0 * * 0 ~/.claude/hooks/cleanup-logs.sh

CLAUDE_DIR="$HOME/.claude"
MAX_AGE_DAYS=14

# Rotate log files (keep last 14 days worth by truncating)
for logfile in "$CLAUDE_DIR"/logs/*.json; do
  [ -f "$logfile" ] || continue
  size=$(stat -f%z "$logfile" 2>/dev/null || stat -c%s "$logfile" 2>/dev/null)
  if [ "$size" -gt 10485760 ]; then  # > 10MB
    echo "Truncating $logfile ($(( size / 1048576 ))MB)"
    tail -c 1048576 "$logfile" > "$logfile.tmp" && mv "$logfile.tmp" "$logfile"
  fi
done

# Clean old debug files
if [ -d "$CLAUDE_DIR/debug" ]; then
  find "$CLAUDE_DIR/debug" -type f -mtime +$MAX_AGE_DAYS -delete 2>/dev/null
  echo "Cleaned debug files older than ${MAX_AGE_DAYS} days"
fi

# Clean old shell snapshots
if [ -d "$CLAUDE_DIR/shell-snapshots" ]; then
  find "$CLAUDE_DIR/shell-snapshots" -type d -empty -mtime +$MAX_AGE_DAYS -delete 2>/dev/null
fi

echo "Cleanup complete: $(date)"
