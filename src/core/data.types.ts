import {
  MapFor,
  MediaTypeObject,
  ParameterObject,
  RequestBodyObject,
  SchemaObject,
} from '../swagger';

/**@readonly */
export const BOOLEAN: SchemaObject = { type: 'boolean' };

/**@readonly */
export const STRING: SchemaObject = { type: 'string' };

/**@readonly */
export const UUID: SchemaObject = { type: 'string', format: 'uuid' };

/**@readonly */
export const EMAIL: SchemaObject = { type: 'string', format: 'email' };

/**@readonly */
export const PASSWORD: SchemaObject = { type: 'string', format: 'password' };

/**@readonly */
export const DATE: SchemaObject = { type: 'string', format: 'date' };

/**@readonly */
export const DATETIME: SchemaObject = { type: 'string', format: 'date-time' };

/**@readonly */
export const BYTE: SchemaObject = { type: 'string', format: 'byte' };

/**@readonly */
export const BINARY: SchemaObject = { type: 'string', format: 'binary' };

/**@readonly */
export const INTEGER: SchemaObject = { type: 'integer' };

/**@readonly */
export const NUMBER: SchemaObject = { type: 'number' };

/**@readonly */
export const INT32: SchemaObject = { type: 'number', format: 'int32' };

/**@readonly */
export const INT64: SchemaObject = { type: 'number', format: 'int64' };

/**@readonly */
export const FLOAT: SchemaObject = { type: 'number', format: 'float' };

/**@readonly */
export const DOUBLE: SchemaObject = { type: 'number', format: 'double' };

export function ENUM(items: string[]): SchemaObject {
  return { type: 'string', enum: items };
}

export function ARRAY(
  items: SchemaObject,
  example?: any,
  extend?: Omit<SchemaObject, 'items' | 'example'>,
): SchemaObject {
  const returnable: SchemaObject = {
    ...extend,
    type: 'array',
    items,
  };

  if (!!example) returnable.example = example;

  return returnable;
}

export function OBJECT(
  properties: { [key: string]: SchemaObject },
  required?: string[],
  example?: any,
  extend?: Omit<SchemaObject, 'properties' | 'required' | 'example'>,
): SchemaObject {
  const returnable: SchemaObject = {
    ...extend,
    type: 'object',
    properties,
  };

  if (!!required) returnable.required = required;
  if (!!example) returnable.example = example;

  return returnable;
}

export function ONEOF(schemas: SchemaObject[]): SchemaObject {
  return { ...OBJECT({}), oneOf: schemas };
}

export function EXTEND(
  schema: SchemaObject,
  extension: Omit<SchemaObject, 'format' | 'enum' | 'type'>,
): SchemaObject {
  return { ...schema, ...extension };
}

export function EXTENDPROPERTIES(
  schema: SchemaObject,
  properties: { [p: string]: SchemaObject },
  required?: Array<string>,
): SchemaObject {
  let _schema = { ...schema };

  let _properties = {
    ...(!!_schema.items ? _schema.items.properties : _schema.properties),
    ...properties,
  };
  let _required = !!_schema.items ? _schema.items.required : _schema.required;

  _required?.push(...(required ?? []));

  if (!!_schema.items)
    return {
      ..._schema,
      items: {
        ..._schema.items,
        required: _required,
        properties: { ..._properties },
      },
    };
  else
    return {
      ..._schema,
      required: _required,
      properties: { ..._properties },
    };
}

export function Example<T>(example: any, extension?: T): T {
  return { ...(extension ?? ({} as T)), example };
}

export function ExampleError<T>(error: any, extension?: T): T {
  return Example<T>({ error }, extension);
}

export function ExampleData<T>(data: any, extension?: T): T {
  return Example<T>({ data }, extension);
}

export function JsonContent(
  schema: SchemaObject,
  extend?: Omit<MediaTypeObject, 'schema'>,
): MapFor<MediaTypeObject> {
  return { ['application/json']: { ...extend, schema } };
}

export function MultipartContent(
  schema: SchemaObject,
  extend?: Omit<MediaTypeObject, 'schema'>,
): MapFor<MediaTypeObject> {
  return { ['multipart/form-data']: { ...extend, schema } };
}

export function Body(
  content: MapFor<MediaTypeObject>,
  extend?: Omit<RequestBodyObject, 'content'>,
): RequestBodyObject {
  return { required: true, ...extend, content };
}

export function ExtendParameter(
  parameter: ParameterObject,
  extension: Omit<ParameterObject, 'name' | 'schema' | 'in'>,
): ParameterObject {
  return { ...parameter, ...extension };
}

export function InQuery(
  name: string,
  schema: SchemaObject,
  extend?: Omit<ParameterObject, 'name' | 'schema' | 'in'>,
): ParameterObject {
  return { ...extend, name, in: 'query', schema };
}

export function InPath(
  name: string,
  schema: SchemaObject,
  extend?: Omit<ParameterObject, 'name' | 'schema' | 'in'>,
): ParameterObject {
  return { ...extend, name, in: 'path', schema, required: true };
}

export function InCookie(
  name: string,
  schema: SchemaObject,
  extend?: Omit<ParameterObject, 'name' | 'schema' | 'in'>,
): ParameterObject {
  return { ...extend, name, in: 'cookie', schema };
}

export function InHeader(
  name: string,
  schema: SchemaObject,
  extend?: Omit<ParameterObject, 'name' | 'schema' | 'in'>,
): ParameterObject {
  return { ...extend, name, in: 'header', schema };
}
