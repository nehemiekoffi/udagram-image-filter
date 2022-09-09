import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  app.get("/filteredimage", async(req: Request, res: Response) => {
    try {
      let imageUrl:string = req.query.image_url;
      // 1. validate the image_url query
      if(imageUrl != null){     
      // 2. call filterImageFromURL(image_url) to filter the image
        let result: string = await filterImageFromURL(imageUrl);
      // 3. send the resulting file in the response
        res.sendFile(result, (err) => {
          // 4. deletes any files on the server on finish of the response
          deleteLocalFiles([result]);
        });
      }else{
        res.status(422).send({code :res.statusCode, message: "`image_url` is required"});
      }
    } catch (error) {
      console.log(error); // Log error
      res.status(500).send({code: res.statusCode, message: 'An Error occurs, Kindly try later.'})
    }

  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req: Request, res: Response) => {
    res.send(`
      <h1>Udagram API</h1>
      <p>Welcome to Udagram ! </p>
      <hr>
      <small>Version: 1.0.0 </small>
      <small>Author : Nehemie KOFFI (CIV)</small>`
    )
  });
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();