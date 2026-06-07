# Biliblocker

A Firefox extension that hides distracting elements on [bilibili.com](https://www.bilibili.com) so you can watch without getting pulled in.

## Features

Each feature can be toggled on or off independently from the popup:

| Toggle | What it hides |
|---|---|
| Hide home feed | The video recommendation grid on the home page |
| Hide sidebar | The recommended videos panel next to the player |
| Hide end screen feed | The video suggestions shown at the end of a video |
| Disable autoplay | Prevents the next video from playing automatically |
| Hide playlist | The episode/playlist panel next to the player |
| Hide comments | The comment section below the video |
| Hide danmaku | The floating bullet comments overlaid on the video |
| Hide thumbnails | Replaces video thumbnails with black rectangles |
| Hide video info | The video description and tags below the player |
| Hide channel info | The uploader's avatar, name, and subscribe button |
| Hide ads | Ad banners on the page |
| Hide header bar | The top navigation bar |

All toggles default to **on** (hidden). Settings are saved and applied instantly without refreshing the page.

## Installation

### Temporary (for testing)

1. Open Firefox and go to `about:debugging`
2. Click **This Firefox** in the left sidebar
3. Click **Load Temporary Add-on...**
4. Select the `manifest.json` file from this project
5. The extension icon will appear in your toolbar

> Note: temporary add-ons are removed when Firefox is closed.

### Permanent (for personal use)

1. Create a free account at [addons.mozilla.org](https://addons.mozilla.org)
2. Go to **Developer Hub → Submit a New Add-on**
3. Choose **"On your own"** (self-distribution — no public listing required)
4. Zip the project folder and upload it
5. Mozilla will auto-sign it and return a `.xpi` file
6. Open the `.xpi` in Firefox to install it permanently

## Usage

Click the **Biliblocker** icon in the Firefox toolbar to open the popup. Check or uncheck any toggle — changes take effect immediately on the current tab.

## Project Structure

```
manifest.json         Extension manifest (MV2)
background/
  background.js       Background script
content/
  content.js          Injects styles and handles toggle logic
popup/
  popup.html          Popup UI
  popup.js            Popup logic (reads/writes settings)
  popup.css           Popup styles
```
