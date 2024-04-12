export class InputHandler { 
    processArgs(args: any[]): { message: string; context: string; id: string , error : Error | undefined } {
      let error: Error | undefined;
      const stringifiedArgs = args.reduce((acc, arg) => {
          if (arg instanceof Error) {
              // Capture the first Error encountered and ignore others if multiple are present
              if (!error) error = arg;
          } else if (typeof arg === 'object') {
                  acc.push(JSON.stringify(arg));
              
          } else {
              // Convert non-objects to string directly
              acc.push(String(arg));
          }
          return acc;
      }, []);

       let id ='';
       let context ='';
       if (args?.length && args?.length >= 3) {
         id = stringifiedArgs.pop() || ''; 
         context = stringifiedArgs.pop() || ''; 
        }

        const message = stringifiedArgs.join(' ');
      

        return { message, context, id, error };
      }
}