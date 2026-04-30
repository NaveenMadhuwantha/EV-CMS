const fs = require('fs');
const path = require('path');

const dirsToProcess = [
  path.join(__dirname, 'src', 'features', 'registration', 'owner'),
  path.join(__dirname, 'src', 'features', 'registration', 'provider')
];

const replacements = [
  // Backgrounds
  { regex: /bg-\[\#0F172A\]/g, replacement: 'bg-[#FCFCFC]' },
  { regex: /bg-\[\#1E293B\]/g, replacement: 'bg-white' },
  { regex: /bg-white\/\[0\.03\]/g, replacement: 'bg-white' },
  { regex: /bg-white\/5/g, replacement: 'bg-[#F8FAFC]' },
  
  // Text Colors
  { regex: /text-\[\#F0F6FF\]/g, replacement: 'text-[#0F172A]' },
  { regex: /text-white/g, replacement: 'text-[#0F172A]' },
  { regex: /text-\[\#8AAFC8\]/g, replacement: 'text-[#64748B]' },
  { regex: /text-\[\#4E7A96\]/g, replacement: 'text-[#64748B]' },

  // Borders
  { regex: /border-white\/10/g, replacement: 'border-[#E2E8F0]' },
  { regex: /border-white\/5/g, replacement: 'border-[#E2E8F0]' },
  { regex: /hover:border-white\/20/g, replacement: 'hover:border-[#3B82F6]/30' },
  { regex: /border-white\/20/g, replacement: 'border-[#E2E8F0]' },

  // Accents / Other Theme Details
  { regex: /bg-\[\#00D4AA\]\/10/g, replacement: 'bg-emerald-50' },
  { regex: /text-\[\#00D4AA\]/g, replacement: 'text-[#059669]' },
  { regex: /bg-\[\#00D4AA\]/g, replacement: 'bg-emerald-600' },
  { regex: /border-\[\#00D4AA\]/g, replacement: 'border-emerald-500' },
  { regex: /from-\[\#00D4AA\]/g, replacement: 'from-emerald-500' },
  { regex: /to-\[\#4FFFB0\]/g, replacement: 'to-emerald-400' },
  { regex: /to-\[\#00A882\]/g, replacement: 'to-emerald-600' },
  
  // Sidebar Gradients
  { regex: /from-\[\#0F172A\]/g, replacement: 'from-[#FCFCFC]' },
  { regex: /via-\[\#0F172A\]\/95/g, replacement: 'via-[#FCFCFC]/95' },
  { regex: /via-\[\#0F172A\]\/90/g, replacement: 'via-[#FCFCFC]/90' }
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      for (const rule of replacements) {
        content = content.replace(rule.regex, rule.replacement);
      }
      
      // Some special cases
      // Replace button text white inside specific components manually or keep it black. 
      // Actually `bg-emerald-600` needs white text if it's a solid button.
      content = content.replace(/bg-emerald-600 text-\[\#0F172A\]/g, 'bg-emerald-600 text-white');
      content = content.replace(/from-emerald-500 to-emerald-400 text-\[\#0F172A\]/g, 'from-emerald-500 to-emerald-400 text-white');
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

for (const dir of dirsToProcess) {
  if (fs.existsSync(dir)) {
    processDirectory(dir);
  }
}

console.log('Theme update complete.');
