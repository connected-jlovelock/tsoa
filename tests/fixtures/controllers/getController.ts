import {
  Example,
  Request,
  Query,
  Get,
  TsoaResponse,
  Route,
  Tags,
} from '../../../src';
import {
  GenericModel,
  TestModel,
  TestSubModel,
  TestClassModel,
} from './../testModel';
import {
  ModelService
} from './../services/modelService';

@Route('GetTest')
export class GetTestController {
  /**
  * This is a description of the getModel method
  * this is some more text on another line
  */
  @Get()
  @Example<TestModel>({
    boolArray: [true, false],
    boolValue: true,
    id: 1,
    modelValue: {
      email: 'test@test.com',
      id: 100,
    },
    modelsArray: new Array<TestSubModel>(),
    numberArray: [1, 2, 3],
    numberValue: 1,
    optionalString: 'optional string',
    strLiteralArr: ['Foo', 'Bar'],
    strLiteralVal: 'Foo',
    stringArray: ['string one', 'string two'],
    stringValue: 'a string'
  })
  public async getModel(): Promise<TsoaResponse<TestModel>> {
    return {body: new ModelService().getModel()};
  }

  @Get('Current')
  public async getCurrentModel(): Promise<TsoaResponse<TestModel>> {
    return {body: new ModelService().getModel()};
  }

  @Get('ClassModel')
  public async getClassModel(): Promise<TsoaResponse<TestClassModel>> {
    return {body: new ModelService().getClassModel()};
  }

  @Get('Multi')
  public async getMultipleModels(): Promise<TsoaResponse<TestModel[]>> {
    return {
      body: [
        new ModelService().getModel(),
        new ModelService().getModel(),
        new ModelService().getModel()
      ]
    };
  }

  /**
  * @param numberPathParam This is a description for numberPathParam
  * @param numberParam This is a description for numberParam
  * @isDouble numberPathParam
  * @minimum numberPathParam 1
  * @maximum numberPathParam 10
  *
  * @minLength stringPathParam 1
  * @maxLength stringPathParam 10
  *
  * @isString stringParam Custom error message
  * @minLength stringParam 3
  * @maxLength stringParam 10
  */
  @Get('{numberPathParam}/{booleanPathParam}/{stringPathParam}')
  public async getModelByParams(
    numberPathParam: number,
    stringPathParam: string,
    booleanPathParam: boolean,
    @Query() booleanParam: boolean,
    @Query() stringParam: string,
    @Query() numberParam: number,
    @Query() optionalStringParam?: string): Promise<TsoaResponse<TestModel>> {
    const model = new ModelService().getModel();
    model.optionalString = optionalStringParam;
    model.numberValue = numberPathParam;
    model.boolValue = booleanPathParam;
    model.stringValue = stringPathParam;

    return {body: model};
  }

  @Get('ResponseWithUnionTypeProperty')
  public async getResponseWithUnionTypeProperty(): Promise<TsoaResponse<Result>> {
    return {
      body: {
        value: 'success'
      },
    };
  }

  @Get('UnionTypeResponse')
  public async getUnionTypeResponse(): Promise<TsoaResponse<string | boolean>> {
    return {body: ''};
  }

  @Get('Request')
  public async getRequest( @Request() request: Object): Promise<TsoaResponse<TestModel>> {
    const model = new ModelService().getModel();
    // set the stringValue from the request context to test successful injection
    model.stringValue = (<any>request).stringValue;
    return {body: model};
  }

  @Get('DateParam')
  public async getByDataParam( @Query() date: Date): Promise<TsoaResponse<TestModel>> {
    const model = new ModelService().getModel();
    model.dateValue = date;

    return {body: model};
  }

  @Get('ThrowsError')
  public async getThrowsError(): Promise<TsoaResponse<TestModel>> {
    throw {
      message: 'error thrown',
      status: 400
    };
  }

  @Get('GeneratesTags')
  @Tags('test', 'test-two')
  public async getGeneratesTags(): Promise<TsoaResponse<TestModel>> {
    return {body: new ModelService().getModel()};
  }

  @Get('HandleBufferType')
  public async getBuffer( @Query() buffer: Buffer): Promise<TsoaResponse<Buffer>> {
    return {body: new Buffer('testbuffer')};
  }

  @Get('GenericModel')
  public async getGenericModel(): Promise<TsoaResponse<GenericModel<TestModel>>> {
    return {
      body: {
        result: new ModelService().getModel()
      },
    };
  }

  @Get('GenericModelArray')
  public async getGenericModelArray(): Promise<TsoaResponse<GenericModel<TestModel[]>>> {
    return {
      body: {
        result: [
          new ModelService().getModel()
        ]
      },
    };
  }

  @Get('GenericPrimitive')
  public async getGenericPrimitive(): Promise<TsoaResponse<GenericModel<string>>> {
    return {
      body: {
        result: new ModelService().getModel().stringValue
      },
    };
  }

  @Get('GenericPrimitiveArray')
  public async getGenericPrimitiveArray(): Promise<TsoaResponse<GenericModel<string[]>>> {
    return {
      body: {
        result: new ModelService().getModel().stringArray
     }
    };
  }
}

export interface ErrorResponse {
  code: string;
  msg: string;
}

export interface CustomError extends Error {
  message: string;
  status: number;
}

export interface Result {
  value: 'success' | 'failure';
}
