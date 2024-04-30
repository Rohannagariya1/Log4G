import logger from './GroMoLogger';

export class InputHandler { 
    processArgs(args: any[]): { message: string; context: string; id: string , error : Error | undefined } {
        let error: Error | undefined;
        //The acc parameter is the accumulator, and the arg parameter is the current value. 
        //In this case, the accumulator is the stringifiedArgs array, and the current value is the arg variable.
        const stringifiedArgs = args.reduce((acc, arg) => {
            if (arg instanceof Error) {
              // Capture the first Error encountered and ignore others if multiple are present
                if (!error) error = arg;
            }else if (typeof arg === 'object') {
                try {
                // Attempt to stringify the object
                acc.push(JSON.stringify(arg));
                } catch (e:any) {
                    if (e instanceof TypeError) {
                    // Log the error and push a placeholder or error description
                    if(typeof e?.message === 'string'){
                        logger.error("Error serializing object:", e.message);
                    }
                    acc.push("[Serialization Error]");
                } else {
                    // For any other type of error, rethrow it
                    if(typeof e?.message === 'string'){
                        logger.error("Error in logging this object",e?.message);
                    }
                    acc.push("[Unknown Error]");
                }
              }
            }else {
            // Convert non-objects to string directly
                try{
                    acc.push(String(arg));
                }
                catch(e:any){
                    logger.error("Error in printing object:", e.message);
                    
                }
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