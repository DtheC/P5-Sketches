# Extend last frame by 3 seconds.
ffmpeg -i video.webm -vf tpad=stop_mode=clone:stop_duration=3 out.mp4



## Not needed:
# Get last frame
ffmpeg -sseof -3 -i video.webm -update 1 -q:v 1 last.png

# Make 3 second video of last frame
ffmpeg -loop 1 -i last.png -t 3 -pix_fmt yuv420p zzzzz.webm

# Make text file of list of videos to mux
(for %i in (*.webm) do @echo file '%i') > mylist.txt

# Mux files
ffmpeg -f concat -safe 0 -i mylist.txt -c copy combo.mp4
