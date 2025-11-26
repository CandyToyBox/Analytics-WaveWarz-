"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBattleFrameHtml = generateBattleFrameHtml;
function generateBattleFrameHtml(battle, baseUrl) {
    if (!battle) {
        return "\n      <!DOCTYPE html>\n      <html>\n        <head>\n          <meta property=\"fc:frame\" content=\"vNext\" />\n          <meta property=\"fc:frame:image\" content=\"https://wavewarz.com/logo.png\" />\n          <meta property=\"fc:frame:button:1\" content=\"Check Back Later\" />\n          <title>No Active Battles</title>\n        </head>\n        <body>No active battles found.</body>\n      </html>\n    ";
    }
    // Use the battle image or a fallback
    var imageUrl = battle.image_url || 'https://wavewarz.com/default-battle.png';
    // Stats
    var tvlA = battle.artist1_pool || 0;
    var tvlB = battle.artist2_pool || 0;
    return "\n    <!DOCTYPE html>\n    <html>\n      <head>\n        <meta property=\"og:title\" content=\"".concat(battle.artist1_name, " vs ").concat(battle.artist2_name, "\" />\n        <meta property=\"og:image\" content=\"").concat(imageUrl, "\" />\n        \n        <meta property=\"fc:frame\" content=\"vNext\" />\n        <meta property=\"fc:frame:image\" content=\"").concat(imageUrl, "\" />\n        <meta property=\"fc:frame:image:aspect_ratio\" content=\"1:1\" />\n        \n        <!-- Button 1: Refresh Stats -->\n        <meta property=\"fc:frame:button:1\" content=\"\uD83D\uDD04 Refresh Stats (A: ").concat(tvlA, " | B: ").concat(tvlB, ")\" />\n        <meta property=\"fc:frame:button:1:action\" content=\"post\" />\n        \n        <!-- Button 2: Link to App -->\n        <meta property=\"fc:frame:button:2\" content=\"\uD83D\uDE80 Vote / Trade on App\" />\n        <meta property=\"fc:frame:button:2:action\" content=\"link\" />\n        <meta property=\"fc:frame:button:2:target\" content=\"https://wavewarz-analytics.vercel.app\" />\n        \n        <title>WaveWarz: ").concat(battle.artist1_name, " vs ").concat(battle.artist2_name, "</title>\n      </head>\n      <body>\n        <h1>WaveWarz Battle</h1>\n        <p>").concat(battle.artist1_name, " vs ").concat(battle.artist2_name, "</p>\n        <p>TVL A: ").concat(tvlA, " SOL</p>\n        <p>TVL B: ").concat(tvlB, " SOL</p>\n        <img src=\"").concat(imageUrl, "\" />\n      </body>\n    </html>\n  ");
}
