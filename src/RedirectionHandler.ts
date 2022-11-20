import { APIGatewayProxyEvent, Context,APIGatewayProxyResultV2 } from "aws-lambda";

import { BatchExecuteStatementCommand, BatchStatementResponse } from '@aws-sdk/client-dynamodb';
import * as AWS from "@aws-sdk/client-dynamodb";

export const lamdaHandler = async(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResultV2>=>{
   var url;
   const table: string| undefined  =  process.env.AWS_DYNAMODB_TABLE;
   const selectPartiQL: string| undefined   = `SELECT * FROM ${table} WHERE id='1'`;

   const client = new AWS.DynamoDBClient({ region: process.env.AWS_REGION });
   const statements : Array<AWS.BatchStatementRequest> = [];
   statements.push({Statement: selectPartiQL});
 
   const params : AWS.BatchExecuteStatementCommandInput = {Statements : statements};
   try{
       const result: AWS.BatchExecuteStatementCommandOutput = await client.send(new BatchExecuteStatementCommand(params));
           console.log(result.Responses)
           if(result.Responses){
               const response : BatchStatementResponse[] = result.Responses;
               console.log(response.length);
               if(response[0].Item){
                   const item = response[0].Item;
                   url = item.domain.S
                 }
           }
       
       
   }catch(error){
       console.log(error)
   }
   return {
      statusCode: 302,
      headers: { Location: url}
     }
 
}
