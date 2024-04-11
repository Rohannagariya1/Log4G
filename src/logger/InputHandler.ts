export class InputHandler { 
    processArgs(args: any[]): { message: string; context: string; id: string } {
        const stringifiedArgs = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        );
       let id ='';
       let context ='';
        if (args.length >= 3) {
         id = stringifiedArgs.pop() || ''; 
         context = stringifiedArgs.pop() || ''; 
        }

        const message = stringifiedArgs.join(' ');
      

        return { message, context, id };
      }
}