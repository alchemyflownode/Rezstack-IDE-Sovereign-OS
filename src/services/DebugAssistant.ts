// src/services/DebugAssistant.ts
export class DebugAssistant {
  static async diagnose(error: Error, context: any) {
    // 1. Parse the error message
    if (error.message.includes('Export default')) {
      const matches = error.message.match(/import (\w+) from '([^']+)'/);
      if (matches) {
        const [_, importedName, filePath] = matches;
        
        // 2. Check the actual file
        const fileContent = await fetch(filePath);
        const hasDefaultExport = fileContent.includes('export default');
        const hasNamedExport = fileContent.includes(`export ${importedName}`);
        
        // 3. Recommend the fix
        if (!hasDefaultExport && hasNamedExport) {
          return {
            rootCause: 'Import/export mismatch',
            fix: `Change to: import { ${importedName} } from '${filePath}'`,
            confidence: 0.95
          };
        }
      }
    }
    return null;
  }
}