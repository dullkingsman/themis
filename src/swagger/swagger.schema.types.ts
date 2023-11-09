/**
 * A generic type that defines a pseudo `Map` type with only a
 * string `key` type.
 */
export interface MapFor<H> {
  [key: string]: H;
}

/**
 * Contact information for the exposed API.
 */
export interface ContactObject {
  /**
   * The identifying name of the contact person/organization.
   */
  name?: string;
  /**
   * The URL pointing to the contact information. MUST be in
   * the format of a URL.
   */
  url?: string;
  /**
   * The email address of the contact person/organization. MUST be in
   * the format of an email address.
   */
  email: string;
}

/**
 * License information for the exposed API.
 */
export interface LicenseObject {
  /**
   * The license name used for the API.
   */
  name: string;
  /**
   * A URL to the license used for the API. MUST be in the format
   * of a URL.
   */
  url?: string;
}

/**
 * The object provides metadata about the API. The metadata MAY
 * be used by the clients if needed, and MAY be presented in
 * editing or documentation generation tools for convenience.
 */
export interface InfoObject {
  /**
   * The title of the API.
   */
  title: string;
  /**
   * A short description of the API.
   * [CommonMark syntax](https://spec.commonmark.org/) MAY be
   * used for rich text representation.
   */
  description?: string;
  /**
   * A URL to the Terms of Service for the API. MUST be in the
   * format of a URL.
   */
  termsOfService?: string;
  /**
   * The contact information for the exposed API.
   */
  contact?: ContactObject;
  /**
   * The license information for the exposed API.
   */
  license?: LicenseObject;
  /**
   * The version of the OpenAPI document (which is distinct from
   * the [OpenAPI Specification version](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#oasVersion)
   * or the API implementation version).
   */
  version: string;
}

/**
 * An object representing a Server Variable for server URL template
 * substitution.
 */
export interface ServerVariableObject {
  /**
   * An enumeration of string values to be used if the
   * substitution options are from a limited set. The array
   * SHOULD NOT be empty.
   */
  enum?: string[];
  /**
   * The default value to use for substitution, which SHALL
   * be sent if an alternate value is not supplied. If the `enum`
   * is defined, the value SHOULD exist in the enum's values.
   */
  default: string;
  /**
   * An optional description for the server variable. [CommonMark
   * syntax](https://spec.commonmark.org/) MAY be used for rich
   * text representation.
   */
  description?: string;
}

/**
 * An object representing a Server.
 */
export interface ServerObject {
  /**
   * A URL to the target host. This URL supports Server Variables
   * and MAY be relative, to indicate that the host location is
   * relative to the location where the OpenAPI document is being
   * served. Variable substitutions will be made when a variable is
   * named in `{brackets}`.
   */
  url: string;
  /**
   * An optional string describing the host designated by the URL.
   * [CommonMark syntax](https://spec.commonmark.org/) MAY be used
   * for rich text representation.
   */
  description?: string;
  /**
   * A map between a variable name and its value. The value is used
   * for substitution in the server's URL template.
   */
  variables?: MapFor<ServerVariableObject>;
}

/**
 * Allows referencing an external resource for extended documentation.
 */
export interface ExternalDocumentationObject {
  /**
   * A short description of the target documentation. [CommonMark
   * syntax](https://spec.commonmark.org/)  MAY be used for rich text
   * representation.
   */
  description?: string;
  /**
   * The URL for the target documentation. Value MUST be in the format
   * of a URL.
   */
  url: string;
}

/**
 * When request bodies or response payloads may be one of a number of
 * different schemas, a `discriminator` object can be used to aid in
 * serialization, deserialization, and validation. The discriminator is
 * a specific object in a schema which is used to inform the consumer of
 * the specification of an alternative schema based on the value associated
 * with it.
 *
 * When using the discriminator, inline schemas will not be considered.
 */
export interface DiscriminatorObject {
  /**
   * The name of the property in the payload that will hold the
   * discriminator value.
   */
  propertyName: string;
  /**
   * An object to hold mappings between payload values and schema names
   * or references.
   */
  mapping?: MapFor<string>;
}

/**
 * A metadata object that allows for more fine-tuned XML model
 * definitions.
 *
 * When using arrays, XML element names are not inferred (for
 * singular/plural forms) and the `name` property SHOULD be used to add
 * that information. See api for expected behavior.
 */
export interface XMLObject {
  /**
   * Replaces the name of the element/attribute used for the described
   * schema property. When defined within `items`, it will affect the
   * name of the individual XML elements within the list. When defined
   * alongside `type` being `array` (outside the `items`), it will affect
   * the wrapping element and only if `wrapped` is `true`. If `wrapped`
   * is `false`, it will be ignored.
   */
  name?: string;
  /**
   * The URI of the namespace definition. Value MUST be in the form of an
   * absolute URI.
   */
  namespace?: string;
  /**
   * The prefix to be used for the name.
   */
  prefix?: string;
  /**
   * Declares whether the property definition translates to an attribute
   * instead of an element. Default value is `false`.
   */
  attribute?: boolean;
  /**
   * MAY be used only for an array definition. Signifies whether the
   * array is wrapped (for example, `<books><book/><book/></books>`) or
   * unwrapped (`<book/><book/>`). Default value is `false`. The
   * definition takes effect only when defined alongside `type` being
   * `array` (outside the `items`).
   */
  wrapped?: boolean;
}

/**
 * A simple object to allow referencing other components in the
 * specification, internally and externally.
 *
 * The Reference Object is defined by
 * [JSON Reference](https://tools.ietf.org/html/draft-pbryan-zyp-json-ref-03)
 * and follows the same structure, behavior and rules.
 *
 * Reference resolution is accomplished as defined by the JSON
 * Reference specification and not by the JSON Schema specification.
 */
export interface ReferenceObject {
  /**
   * The reference string.
   */
  ['$ref']: string;
}

/**
 * In all cases, the example value is expected to be compatible with
 * the type schema of its associated value. Tooling implementations
 * MAY choose to validate compatibility automatically, and reject the
 * example value(s) if incompatible.
 */
export interface ExampleObject {
  /**
   * Short description for the example.
   */
  summary?: string;
  /**
   * Long description for the example. [CommonMark
   * syntax](https://spec.commonmark.org/) MAY be used for rich text
   * representation.
   */
  description?: string;
  /**
   * Embedded literal example. The `value` field and `externalValue`
   * field are mutually exclusive. To represent api of media
   * themis that cannot naturally represented in JSON or YAML, use a
   * string value to contain the example, escaping where necessary.
   */
  value?: any;
  /**
   * A URL that points to the literal example. This provides the
   * capability to reference api that cannot easily be included
   * in JSON or YAML documents. The `value` field and `externalValue`
   * field are mutually exclusive.
   */
  externalValue?: string;
}

/**
 * The Schema Object allows the definition of input and output data
 * themis. These themis can be objects, but also primitives and arrays.
 * This object is an extended subset of the [JSON Schema Specification
 * Wright Draft 00](https://json-schema.org/).
 *
 * For more information about the properties, see [JSON Schema
 * Core](https://tools.ietf.org/html/draft-wright-json-schema-00) and
 * [JSON Schema Validation](https://tools.ietf.org/html/draft-wright-json-schema-validation-00).
 * Unless stated otherwise, the property defin itions follow the JSON Schema.
 *
 * Additional properties defined by the JSON Schema specification that
 * are not mentioned here are strictly unsupported.
 */
export interface SchemaObject {
  /**
   * Short information about the data.
   */
  title?: string;
  /**
   * An extended description of the schema and its contents.
   * [CommonMark syntax](https://spec.commonmark.org/) MAY
   * be used for rich text representation.
   */
  description?: string;
  /**
   * A number strictly greater than 0 which tells that a
   * numeric instance is valid only if division by this
   * keyword's value results in an integer.
   */
  multipleOf?: number;
  /**
   * An inclusive upper limit for a numeric instance.
   */
  maximum?: number;
  /**
   * An exclusive upper limit for a numeric instance.
   */
  exclusiveMaximum?: number;
  /**
   * An inclusive lower limit for a numeric instance.
   */
  minimum?: number;
  /**
   * An exclusive lower limit for a numeric instance.
   */
  exclusiveMinimum?: number;
  /**
   * A non-negative integer value that is an inclusive
   * upper limit for the length of a string instance.
   */
  maxLength?: number;
  /**
   * A non-negative integer value that is an inclusive
   * lower limit for the length of a string instance.
   */
  minLength?: number;
  /**
   * A non-negative integer value that is an inclusive
   * upper limit for the size of an array instance.
   */
  maxItems?: number;
  /**
   * A non-negative integer value that is an inclusive
   * lower limit for the size of an array instance.
   */
  minItems?: number;
  /**
   * Value indicating that all elements of the schema
   * MUST be unique.
   */
  uniqueItems?: boolean;
  /**
   * A non-negative integer value that is an inclusive
   * upper limit for the number of properties with in
   * an object instance.
   */
  maxProperties?: number;
  /**
   * A non-negative integer value that is an inclusive
   * lower limit for the number of properties with in
   * an object instance.
   */
  minProperties?: number;
  /**
   * A list of unique strings that mark certain properties
   * of the schema as required fields.
   */
  required?: string[];
  /**
   * A definition for the values of an enumerable.
   */
  enum?: any[];
  /**
   * A valid regular expression as defined by
   * [Ecma-262 Edition 5.1 regular expression dialect](https://www.ecma-international.org/ecma-262/5.1/#sec-15.10.1),
   * which is used to validate a string instance.
   */
  pattern?: string;
  /**
   * The data type of the schema to be defined.
   */
  type:
    | string
    | 'object'
    | 'array'
    | 'integer'
    | 'number'
    | 'string'
    | 'boolean';
  /**
   * Specifies a type validation that requires the
   * schema to be valid against all specified
   * schemas.
   */
  allOf?: SchemaObject[];
  /**
   * Specifies a type validation that requires the
   * schema to be valid against only one of the
   * specified schemas.
   */
  oneOf?: SchemaObject[];
  /**
   * Specifies a type validation that requires the
   * schema to be valid against at least one of the
   * specified schemas.
   */
  anyOf?: SchemaObject[];
  /**
   * Specifies a negating type validation.
   */
  not?: SchemaObject;
  /**
   * Specifies the schema of a single array instance.
   */
  items?: SchemaObject;
  /**
   * Specifies the properties that the schema contains.
   */
  properties?: { [key: string]: SchemaObject };
  /**
   * Specifies the properties that a child instance of
   * the schema contains.
   */
  additionalProperties?: SchemaObject | boolean;
  /**
   * The format in which the data is represented. This is a sub-type
   * categorization.
   */
  format?:
    | string
    | 'int32'
    | 'int64'
    | 'float'
    | 'double'
    | 'byte'
    | 'binary'
    | 'date'
    | 'date-time'
    | 'password'
    | 'email'
    | 'uuid';
  /**
   * The default value represents what would be assumed by the
   * consumer of the input as the value of the schema if one is not
   * provided. Unlike JSON Schema, the value MUST conform to the
   * defined type for the Schema Object defined at the same level.
   * For example, if `type` is `string`, then `default` can be `"foo"` but
   * cannot be `1`.
   */
  default?: any;
  /**
   * A `true` value adds `"null"` to the allowed type specified by the
   * `type` keyword, only if `type` is explicitly defined within the
   * same Schema Object. Other Schema Object constraints retain
   * their defined behavior, and therefore may disallow the use of
   * `null` as a value. A `false` value leaves the specified or default
   * `type` unmodified. The default value is `false`.
   */
  nullable?: boolean;
  /**
   * Adds support for polymorphism. The discriminator is an object
   * name that is used to differentiate between other schemas which
   * may satisfy the payload description.
   */
  discriminator?: DiscriminatorObject;
  /**
   * Relevant only for Schema `"properties"` definitions. Declares
   * the property as "read only". This means that it MAY be sent as
   * part of a response but SHOULD NOT be sent as part of the request.
   * If the property is marked as `readOnly` being `true` and is in
   * the `required` list, the `required` will take effect on the
   * response only. A property MUST NOT be marked as both `readOnly`
   * and `writeOnly` being `true`. Default value is `false`.
   */
  readonly?: boolean;
  /**
   * Relevant only for Schema `"properties"` definitions. Declares
   * the property as `"write only"`. Therefore, it MAY be sent as
   * part of a request but SHOULD NOT be sent as part of the
   * response. If the property is marked as `writeOnly` being `true`
   * and is in the `required` list, the `required` will take effect on
   * the request only. A property MUST NOT be marked as both
   * `readOnly` and `writeOnly` being `true`. Default value is `false`.
   */
  writeOnly?: boolean;
  /**
   * This MAY be used only on properties schemas. It has no
   * effect on root schemas. Adds additional metadata to describe
   * the XML representation of this property.
   */
  xml?: XMLObject;
  /**
   * Additional external documentation for this schema.
   */
  externalDocs?: ExternalDocumentationObject;
  /**
   * A free-form property to include an example of an instance
   * for this schema. To represent api that cannot be
   * naturally represented in JSON or YAML, a string value can
   * be used to contain the example with escaping where necessary.
   */
  example?: any;
  /**
   * Specifies that a schema is deprecated and SHOULD be
   * transitioned out of usage. Default value is *`false`*.
   */
  deprecated?: boolean;
}

/**
 * Extend and override.
 */
export type Modify<T, R> = Omit<T, keyof R> & R;

/**
 * The Header Object follows the structure of the Parameter Object
 * with slight variation.
 */
export type HeaderObject = Omit<
  ParameterObject,
  keyof {
    name: undefined;
    in: undefined;
  }
>;

/**
 * A single encoding definition applied to a single schema
 * property.
 */
export interface EncodingObject {
  /**
   * The Content-Type for encoding a specific property.
   * Default value depends on the property type: for `string`
   * with `format` being `binary` – `application/octet-stream`;
   * for other primitive themis – `text/plain`; for `object` -
   * `application/json`; for `array` – the default is defined
   * based on the inner type. The value can be a specific media
   * type (e.g. application/json), a wildcard media type (e.g.
   * `image/*`), or a comma-separated list of the two themis.
   */
  contentType?: string;
  /**
   * A map allowing additional information to be provided as
   * headers, for example `Content-Disposition`. `Content-Type`
   * is described separately and SHALL be ignored in this
   * section. This property SHALL be ignored if the request
   * body media type is not a `multipart`.
   */
  headers?: MapFor<HeaderObject | ReferenceObject>;
  /**
   * Describes how a specific property value will be serialized
   * depending on its type. The behavior follows the same values
   * as `query` parameters, including default values. This
   * property SHALL be ignored if the request body media type is
   * not `application/x-www-form-urlencoded`.
   */
  style?:
    | 'matrix'
    | 'label'
    | 'form'
    | 'simple'
    | 'spaceDelimited'
    | 'pipeDelimited'
    | 'deepObject';
  /**
   * When this is true, property values of type `array` or `object`
   * generate separate parameters for each value of the array,
   * or key-value-pair of the map. For other themis of properties
   * this property has no effect. When `style` is `form`, the default
   * value is `true`. For all other styles, the default value is
   * `false`. This property SHALL be ignored if the request body
   * media type is not `application/x-www-form-urlencoded`.
   */
  explode?: boolean;
  /**
   * Determines whether the parameter value SHOULD allow reserved
   * characters, as defined by
   * [RFC3986](https://tools.ietf.org/html/rfc3986#section-2.2)
   * `:/?#[]@!$&'()*+,;=` to be included without percent-encoding.
   * The default value is `false`. This property SHALL be ignored
   * if the request body media type is not
   * `application/x-www-form-urlencoded`.
   */
  allowReserved?: boolean;
}

/**
 * Each Media Type Object provides schema and api for the media
 * type identified by its key.
 */
export interface MediaTypeObject {
  /**
   * The schema defining the content of the request, response,
   * or parameter.
   */
  schema?: SchemaObject | ReferenceObject;
  /**
   * Example of the media type. The example object SHOULD be in
   * the correct format as specified by the media type. The
   * `example` field is mutually exclusive of the `api` field.
   * Furthermore, if referencing a `schema` which contains an
   * example, the `example` value SHALL override the example
   * provided by the schema.
   */
  example?: any;
  /**
   * Examples of the media type. Each example object SHOULD match
   * the media type and specified schema if present. The `api`
   * field is mutually exclusive of the `example` field.
   * Furthermore, if referencing a schema which contains an
   * example, the `api` value SHALL override the example
   * provided by the schema.
   */
  examples?: MapFor<ExampleObject | ReferenceObject>;
  /**
   * A map between a property name and its encoding information.
   * The key, being the property name, MUST exist in the schema
   * as a property. The encoding object SHALL only apply to
   * `requestBody` objects when the media type is `multipart` or
   * `application/x-www-form-urlencoded`.
   */
  encoding?: MapFor<EncodingObject>;
}

/**
 * Describes a single operation parameter.
 *
 * A unique parameter is defined by a combination of a `name` and
 * `location`.
 * ___
 * ### Parameter Locations
 * There are four possible parameter locations specified by the `in`
 * field:
 * * path - Used together with `Path Templating`, where the parameter
 *   value is actually part of the operation's URL. This does not
 *   include the host or base path of the API. For example, in
 *   `/items/{itemId}`, the path parameter is `itemId`.
 * * query - Parameters that are appended to the URL. For example, in
 *   `/items?id=###`, the query parameter is `id`.
 * * header - Custom headers that are expected as part of the request.
 *   Note that [RFC7230](https://tools.ietf.org/html/rfc7230#page-22)
 *   states header names are case insensitive.
 * * cookie - Used to pass a specific cookie value to the API.
 *
 * The rules for serialization of the parameter are specified in one
 * of two ways. For simpler scenarios, a `schema` and `style` can describe
 * the structure and syntax of the parameter.
 *
 * For more complex scenarios, the `content` property can define the
 * media type and schema of the parameter. A parameter MUST contain
 * either a `schema` property, or a `content` property, but not both. When
 * `example` or `api` are provided in conjunction with the `schema`
 * object, the example MUST follow the prescribed serialization
 * strategy for the parameter.
 */
export interface ParameterObject {
  /**
   * The name of the parameter. Parameter names are case sensitive.
   * * If `in` is `"path"`, the `name` field MUST correspond to a
   *   template expression occurring within the path field in the
   *   Paths Object.
   * * If `in` is `"header"` and the `name` field is `"Accept"`,
   *   `"Content-Type"` or `"Authorization"`, the parameter
   *   definition SHALL be ignored.
   * * For all other cases, the `name` corresponds to the parameter
   *   name used by the `in` property.
   */
  name: string;
  /**
   * The location of the parameter. Possible values are `"query"`,
   * `"header"`, `"path"` or `"cookie"`.
   */
  in: 'query' | 'header' | 'path' | 'cookie';
  /**
   * A brief description of the parameter. This could contain
   * api of use.
   * [CommonMark syntax](https://spec.commonmark.org/) MAY be used
   * for rich text representation.
   */
  description?: string;
  /**
   * Determines whether this parameter is mandatory. Default value
   * is *`false`*.
   * ___
   * **REQUIRED** if the parameter location is *`"path"`* (the value
   * must be *`true`*).
   */
  required?: boolean;
  /**
   * Specifies that a parameter is deprecated and SHOULD be
   * transitioned out of usage. Default value is `false`.
   */
  deprecated?: boolean;
  /**
   * Sets the ability to pass empty-valued parameters. This is valid
   * only for query parameters and allows sending a parameter with
   * an empty value. Default value is `false`. If `style` is used, and
   * if behavior is `n/a` (cannot be serialized), the value of
   * `allowEmptyValue` SHALL be ignored. Use of this property is NOT
   * RECOMMENDED, as it is likely to be removed in a later revision.
   */
  allowEmptyValue?: boolean;
  /**
   * Describes how the parameter value will be serialized depending
   * on the type of the parameter value. Default values (based on
   * value of `in`): for `query` - `form`; for `path` - `simple`; for
   * `header` - `simple`; for `cookie` - `form`.
   */
  style?:
    | 'matrix'
    | 'label'
    | 'form'
    | 'simple'
    | 'spaceDelimited'
    | 'pipeDelimited'
    | 'deepObject';
  /**
   * When this is true, parameter values of type `array` or
   * `object` generate separate parameters for each value of the
   * array or key-value pair of the map. For other themis of
   * parameters this property has no effect. When `style` is `form`,
   * the default value is `true`. For all other styles, the default
   * value is `false`.
   */
  explode?: boolean;
  /**
   * Determines whether the parameter value SHOULD allow reserved
   * characters, as defined by
   * [RFC3986](https://tools.ietf.org/html/rfc3986#section-2.2)
   * `:/?#[]@!$&'()*+,;=` to be included without percent-encoding.
   * This property only applies to parameters with an `in` value
   * of `query`. The default value is `false`.
   */
  allowReserved?: boolean;
  /**
   * The schema defining the type used for the parameter.
   */
  schema: SchemaObject | ReferenceObject;
  /**
   * Example of the parameter's potential value. The example
   * SHOULD match the specified schema and encoding properties if
   * present. The `example` field is mutually exclusive of the
   * `api` field. Furthermore, if referencing a `schema` that
   * contains an example, the `example` value SHALL override the
   * example provided by the schema. To represent api of media
   * themis that cannot naturally be represented in JSON or YAML, a
   * string value can contain the example with escaping where
   * necessary.
   */
  example?: any;
  /**
   * Examples of the parameter's potential value. Each example
   * SHOULD contain a value in the correct format as specified in
   * the parameter encoding. The `api` field is mutually
   * exclusive of the `example` field. Furthermore, if referencing
   * a `schema` that contains an example, the `api` value SHALL
   * override the example provided by the schema.
   */
  examples?: MapFor<ExampleObject | ReferenceObject>;
  /**
   * A map containing the representations for the parameter. The key
   * is the media type and the value describes it. The map MUST only
   * contain one entry.
   */
  content?: MapFor<MediaTypeObject>;
}

/**
 * Describes a single request body.
 */
export interface RequestBodyObject {
  /**
   * A brief description of the request body. This could contain
   * api of use. [CommonMark
   * syntax](https://spec.commonmark.org/) MAY be used for rich
   * text representation.
   */
  description?: string;
  /**
   * The content of the request body. The key is a media type or
   * [media type range](https://tools.ietf.org/html/rfc7231#appendix-D)
   * and the value describes it. For requests that match multiple keys,
   * only the most specific key is applicable.
   * e.g. text/plain overrides text/*
   */
  content: MapFor<MediaTypeObject>;
  /**
   * Determines if the request body is required in the request.
   * Defaults to `false`.
   */
  required?: boolean;
}

export type HTTPStatusCode = string;

/**
 * Use *`"default"`* for the documentation of responses other than the
 * ones declared for specific HTTP response codes.
 *
 * For specific HTTP response codes any HTTP status code can be used as
 * the property name, but only one property per code, to describe the
 * expected response for that HTTP status code. In this use case the
 * key MUST be enclosed in quotation marks (for example, "200") for
 * compatibility between JSON and YAML. To define a range of response
 * codes, this field MAY contain the uppercase wildcard character `X`.
 * For example, `2XX` represents all response codes between `[200-299]`.
 * Only the following range definitions are allowed: `1XX`, `2XX`,
 * `3XX`, `4XX`, and `5XX`. If a response is defined using an explicit
 * code, the explicit code definition takes precedence over the range
 * definition for that code.
 */
export type ResponseObjectKey = 'default' | HTTPStatusCode;

/**
 * A container for the expected responses of an operation. The container
 * maps a HTTP response code to the expected response.
 *
 * The documentation is not necessarily expected to cover all possible
 * HTTP response codes because they may not be known in advance. However,
 * documentation is expected to cover a successful operation response
 * and any known errors.
 *
 * The `default` MAY be used as a default response object for all HTTP
 * codes that are not covered individually by the specification.
 *
 * The `Responses Object` MUST contain at least one response code, and it
 * SHOULD be the response for a successful operation call.
 */
export type ResponsesObject = {
  /**
   * A Reference Object can link to a response that the OpenAPI Object's
   * components/responses section defines.
   */
  [statusCode in ResponseObjectKey]?: ResponseObject | ReferenceObject;
};

/**
 * A map of possible out-of band callbacks related to the parent operation.
 * Each value in the map is a Path Item Object that describes a set of
 * requests that may be initiated by the API provider and the expected
 * responses. The key value used to identify the path item object is an
 * expression, evaluated at runtime, that identifies a URL to use for the
 * callback operation.
 *
 * The key that identifies the Path Item Object is a runtime expression
 * that can be evaluated in the context of a runtime HTTP request/response
 * to identify the URL to be used for the callback request. A simple
 * example might be `$request.body#/url`.
 */
export interface CallbackObject {
  /**
   * A Path Item Object used to define a callback request and expected
   * responses. A [complete example](https://github.com/OAI/OpenAPI-Specification/blob/main/examples/v3.0/callback-example.yaml)
   * is available.
   */
  [expression: string]: PathItemObject;
}

/**
 * Describes a single API operation on a path.
 */
export interface OperationObject {
  /**
   * A list of tags for API documentation control. Tags can be used for
   * logical grouping of operations by resources or any other qualifier.
   */
  tags?: string[];
  /**
   * A short summary of what the operation does.
   */
  summary?: string;
  /**
   * A verbose explanation of the operation behavior.
   * [CommonMark syntax](https://spec.commonmark.org/)
   * MAY be used for rich text representation.
   */
  description?: string;
  /**
   * Additional external documentation for this operation.
   */
  externalDocs?: ExternalDocumentationObject;
  /**
   * Unique string used to identify the operation. The id MUST be unique
   * among all operations described in the API. The operationId value is
   * case-sensitive. Tools and libraries MAY use the operationId to
   * uniquely identify an operation, therefore, it is RECOMMENDED to
   * follow common programming naming conventions.
   */
  operationId?: string;
  /**
   * A list of parameters that are applicable for this operation. If a
   * parameter is already defined at the Path Item, the new definition
   * will override it but can never remove it. The list MUST NOT include
   * duplicated parameters. A unique parameter is defined by a
   * combination of a name and location. The list can use the Reference
   * Object to link to parameters that are defined at the OpenAPI
   * Object's components/parameters.
   */
  parameters?: (ParameterObject | ReferenceObject)[];
  /**
   * The request body applicable for this operation. The `requestBody`
   * is only supported in HTTP methods where the HTTP 1.1 specification
   * [RFC7231](https://tools.ietf.org/html/rfc7231#section-4.3.1) has
   * explicitly defined semantics for request bodies. In
   * other cases where the HTTP spec is vague, `requestBody` SHALL be
   * ignored by consumers.
   */
  requestBody?: RequestBodyObject | ReferenceObject;
  /**
   * The list of possible responses as they are returned from executing
   * this operation.
   */
  responses: ResponsesObject;
  /**
   * A map of possible out-of band callbacks related to the parent
   * operation. The key is a unique identifier for the Callback Object.
   * Each value in the map is a Callback Object that describes a
   * request that may be initiated by the API provider and the expected
   * responses.
   */
  callbacks?: MapFor<CallbackObject | ReferenceObject>;
  /**
   * Declares this operation to be deprecated. Consumers SHOULD refrain
   * from usage of the declared operation. Default value is `false`.
   */
  deprecated?: boolean;
  /**
   * A declaration of which security mechanisms can be used for this
   * operation. The list of values includes alternative security
   * requirement objects that can be used. Only one of the security
   * requirement objects need to be satisfied to authorize a request.
   * To make security optional, an empty security requirement (`{}`) can
   * be included in the array. This definition overrides any declared
   * top-level security. To remove a top-level security declaration, an
   * empty array can be used.
   */
  security?: SecurityRequirementObject[];
  /**
   * An alternative `server` array to service this operation. If an
   * alternative `server` object is specified at the Path Item Object or
   * Root level, it will be overridden by this value.
   */
  servers?: ServerObject[];
}

/**
 * Describes the operations available on a single path. A Path Item
 * MAY be empty, due to ACL constraints. The path itself is still
 * exposed to the documentation viewer but they will not know which
 * operations and parameters are available.
 */
export interface PathItemObject {
  /**
   * Allows for an external definition of this path item. The
   * referenced structure MUST be in the format of a Path Item
   * Object. In case a Path Item Object field appears both in the
   * defined object and the referenced object, the behavior is
   * undefined.
   */
  ['$ref']?: string;
  /**
   * An optional, string summary, intended to apply to all
   * operations in this path.
   */
  summary?: string;
  /**
   * An optional, string description, intended to apply to all
   * operations in this path. [CommonMark
   * syntax](https://spec.commonmark.org/) MAY be used for
   * rich text representation.
   */
  description?: string;
  /**
   * A definition of a GET operation on this path.
   */
  get?: OperationObject;
  /**
   * A definition of a PUT operation on this path.
   */
  put?: OperationObject;
  /**
   * A definition of a POST operation on this path.
   */
  post?: OperationObject;
  /**
   * A definition of a DELETE operation on this path.
   */
  delete?: OperationObject;
  /**
   * A definition of a OPTIONS operation on this path.
   */
  options?: OperationObject;
  /**
   * A definition of a HEAD operation on this path.
   */
  head?: OperationObject;
  /**
   * A definition of a PATCH operation on this path.
   */
  patch?: OperationObject;
  /**
   * A definition of a TRACE operation on this path.
   */
  trace?: OperationObject;
  /**
   * An alternative `server` array to service all operations
   * in this path.
   */
  servers?: ServerObject[];
  /**
   * A list of parameters that are applicable for all the operations
   * described under this path. These parameters can be overridden
   * at the operation level, but cannot be removed there. The list
   * MUST NOT include duplicated parameters. A unique parameter is
   * defined by a combination of a name and location. The list can
   * use the Reference Object to link to parameters that are defined
   * at the OpenAPI Object's components/parameters.
   */
  parameters?: (ParameterObject | ReferenceObject)[];
}

/**
 * Holds the relative paths to the individual endpoints and their
 * operations. The path is appended to the URL from the `Server Object`
 * in order to construct the full URL. The Paths MAY be empty, due to
 * ACL constraints.
 */
export interface PathsObject {
  /**
   * A relative path to an individual endpoint. The field name MUST
   * begin with a forward slash (`/`). The path is appended (no
   * relative URL resolution) to the expanded URL from the
   * `Server Object`'s url field in order to construct the full URL.
   * `Path templating` is allowed. When matching URLs, concrete
   * (non-templated) paths would be matched before their templated
   * counterparts. Templated paths with the same hierarchy but
   * different templated names MUST NOT exist as they are identical.
   * In case of ambiguous matching, it's up to the tooling to decide
   * which one to use.
   */
  [path: string]: PathItemObject;
}

/**
 * The `Link object` represents a possible design-time link for a response.
 * The presence of a link does not guarantee the caller's ability to
 * successfully invoke it, rather it provides a known relationship and
 * traversal mechanism between responses and other operations.
 *
 * Unlike *dynamic* links (i.e. links provided in the response payload), the
 * OAS linking mechanism does not require link information in the runtime
 * response.
 *
 * For computing links, and providing instructions to execute them, a
 * runtime expression is used for accessing values in an operation and
 * using them as parameters while invoking the linked operation.
 */
export interface LinkObject {
  /**
   * A relative or absolute URI reference to an OAS operation. This
   * field is mutually exclusive of the `operationId` field, and
   * MUST point to an Operation Object. Relative `operationRef`
   * values MAY be used to locate an existing Operation Object in
   * the OpenAPI definition.
   */
  operationRef?: string;
  /**
   * The name of an existing, resolvable OAS operation, as defined
   * with a unique `operationId`. This field is mutually exclusive of
   * the `operationRef` field.
   */
  operationId?: string;
  /**
   * A map representing parameters to pass to an operation as
   * specified with `operationId` or identified via `operationRef`.
   * The key is the parameter name to be used, whereas the value can
   * be a constant or an expression to be evaluated and passed to the
   * linked operation. The parameter name can be qualified using the
   * parameter location `[{in}.]{name}` for operations that use the
   * same parameter name in different locations (e.g. path.id).
   */
  parameters?: MapFor<any | string>;
  /**
   * A literal value or expression to use as a request body when
   * calling the target operation.
   */
  requestBody?: any | string;
  /**
   * A description of the link.
   * [CommonMark syntax](https://spec.commonmark.org/) MAY be used
   * for rich text representation.
   */
  description?: string;
  /**
   * A server object to be used by the target operation.
   */
  server?: ServerObject;
}

/**
 * Describes a single response from an API Operation, including
 * design-time, static `links` to operations based on the response.
 */
export interface ResponseObject {
  /**
   * A short description of the response.
   * [CommonMark syntax](https://spec.commonmark.org/) MAY be used
   * for rich text representation.
   */
  description: string;
  /**
   * Maps a header name to its definition.
   * [RFC7230](https://tools.ietf.org/html/rfc7230#page-22) states
   * header names are case insensitive. If a response header is
   * defined with the name `"Content-Type"`, it SHALL be ignored.
   */
  headers?: MapFor<HeaderObject | ReferenceObject>;
  /**
   * A map containing descriptions of potential response payloads.
   * The key is a media type or
   * [media type range](https://tools.ietf.org/html/rfc7231#appendix-D)
   * and the value describes it. For responses that match multiple keys,
   * only the most specific key is applicable.
   * e.g. text/plain overrides text/*
   */
  content?: MapFor<MediaTypeObject>;
  /**
   * A map of operations links that can be followed from the response.
   * The key of the map is a short name for the link, following the
   * naming constraints of the names for Component Objects.
   */
  links?: MapFor<LinkObject | ReferenceObject>;
}

/**
 * Holds a set of reusable objects for different aspects of the OAS.
 * All objects defined within the components object will have no effect
 * on the API unless they are explicitly referenced from properties
 * outside the components object.
 *
 * All the fixed fields declared above are objects that MUST use keys
 * that match the regular expression: `^[a-zA-Z0-9\.\-_]+$`.
 */
export interface ComponentsObject {
  /**
   * An object to hold reusable Schema Objects.
   */
  schemas?: MapFor<SchemaObject | ReferenceObject>;
  /**
   * An object to hold reusable Response Objects.
   */
  responses?: MapFor<ResponseObject | ReferenceObject>;
  /**
   * An object to hold reusable Parameter Objects.
   */
  parameters?: MapFor<ParameterObject | ReferenceObject>;
  /**
   * An object to hold reusable Example Objects.
   */
  examples?: MapFor<ExampleObject | ReferenceObject>;
  /**
   * An object to hold reusable Request Body Objects.
   */
  requestBodies?: MapFor<RequestBodyObject | ReferenceObject>;
  /**
   * An object to hold reusable Header Objects.
   */
  headers?: MapFor<HeaderObject | ReferenceObject>;
  /**
   * An object to hold reusable Security Scheme Objects.
   */
  securitySchemes?: MapFor<SecuritySchemeObject | ReferenceObject>;
  /**
   * An object to hold reusable Link Objects.
   */
  links?: MapFor<LinkObject | ReferenceObject>;
  /**
   * An object to hold reusable Callback Objects.
   */
  callbacks?: MapFor<CallbackObject | ReferenceObject>;
}

/**
 * Configuration details for a supported OAuth Flow
 */
export interface OAuthFlowObject {
  /**
   * The authorization URL to be used for this flow.
   * This MUST be in the form of a URL.
   * ___
   * **APPLIES TO AND REQUIRED** for *`"oauth2" ("implicit",
   * "authorizationCode")`*
   */
  authorizationUrl?: string;
  /**
   * The token URL to be used for this flow. This MUST be
   * in the form of a URL.
   * ___
   * **APPLIES AND REQUIRED** for *`"oauth2" ("password",
   * "clientCredentials", "authorizationCode")`*
   */
  tokenUrl?: string;
  /**
   * The URL to be used for obtaining refresh tokens. This MUST
   * be in the form of a URL.
   * ___
   * **APPLIES** to *`"oauth2"`*
   */
  refreshUrl?: string;
  /**
   * The available scopes for the OAuth2 security scheme. A map
   * between the scope name and a short description for it. The
   * map MAY be empty.
   * ___
   * **APPLIES** to and **REQUIRED** for *`"oauth2"`*
   */
  scopes?: MapFor<string>;
}

/**
 * Allows configuration of the supported OAuth Flows.
 */
export interface OAuthFlowsObject {
  /**
   * Configuration for the OAuth Implicit flow
   */
  implicit?: OAuthFlowObject;
  /**
   * Configuration for the OAuth Resource Owner Password flow
   */
  password?: OAuthFlowObject;
  /**
   * Configuration for the OAuth Client Credentials flow.
   * Previously called `application` in OpenAPI 2.0.
   */
  clientCredentials?: OAuthFlowObject;
  /**
   * Configuration for the OAuth Authorization Code flow.
   * Previously called `accessCode` in OpenAPI 2.0.
   */
  authorizationCode?: OAuthFlowObject;
}

export type ValidSecuritySchemeType =
  | 'apiKey'
  | 'http'
  | 'oauth2'
  | 'openIdConnect';

/**
 * Defines a security scheme that can be used by the operations.
 * Supported schemes are HTTP authentication, an API key (either as
 * a header, a cookie parameter or as a query parameter), OAuth2's
 * common flows (implicit, password, client credentials and
 * authorization code) as defined in
 * [RFC6749](https://tools.ietf.org/html/rfc6749), and [OpenID
 * Connect Discovery](https://tools.ietf.org/html/draft-ietf-oauth-discovery-06).
 */
export interface SecuritySchemeObject {
  /**
   * The type of the security scheme. Valid values are "apiKey",
   * "http", "oauth2", "openIdConnect".
   */
  type: ValidSecuritySchemeType;
  /**
   * A short description for security scheme. [CommonMark
   * syntax](https://spec.commonmark.org/) MAY be used for rich
   * text representation.
   */
  description?: string;
  /**
   * The name of the header, query or cookie parameter to be
   * used.
   * ___
   * **APPLIES** to and **REQUIRED** for *`"apiKey"`*
   */
  name?: string;
  /**
   * The location of the API key. Valid values are "query",
   * "header" or "cookie".
   * ___
   * **APPLIES** to and **REQUIRED** for *`"apiKey"`*
   */
  in?: 'query' | 'header' | 'cookie';
  /**
   * The name of the HTTP Authorization scheme to be used in the
   * [Authorization header as defined in RFC7235](https://tools.ietf.org/html/rfc7235#section-5.1).
   * The values used SHOULD be registered in the [IANA Authentication
   * Scheme registry](https://www.iana.org/assignments/http-authschemes/http-authschemes.xhtml).
   * ___
   * **APPLIES** to and **REQUIRED** for *`"http"`*
   */
  scheme?: string;
  /**
   * A hint to the client to identify how the bearer token is
   * formatted. Bearer tokens are usually generated by an
   * authorization server, so this information is primarily for
   * documentation purposes.
   * ___
   * **APPLIES** to *`"http" ("bearer")`*
   */
  bearerFormat?: string;
  /**
   * An object containing configuration information for the flow
   * themis supported.
   * ___
   * **APPLIES** to and **REQUIRED** for *`"oauth2"`*
   */
  flows?: OAuthFlowsObject;
  /**
   * OpenId Connect URL to discover OAuth2 configuration values.
   * This MUST be in the form of a URL.
   * ___
   * **APPLIES** to and **REQUIRED** for *`"openIdConnect"`*
   */
  openIdConnectUrl?: string;
}

/**
 * Lists the required security schemes to execute this operation. The
 * name used for each property MUST correspond to a security scheme
 * declared in the Security Schemes under the Components Object.
 *
 * Security Requirement Objects that contain multiple schemes require
 * that all schemes MUST be satisfied for a request to be authorized.
 * This enables support for scenarios where multiple query parameters
 * or HTTP headers are required to convey security information.
 *
 * When a list of Security Requirement Objects is defined on the OpenAPI
 * Object or Operation Object, only one of the Security Requirement
 * Objects in the list needs to be satisfied to authorize the request.
 */
export type SecurityRequirementObject = {
  /**
   * Each name MUST correspond to a security scheme which is declared
   * in the Security Schemes under the Components Object. If the
   * security scheme is of type `"oauth2"` or `"openIdConnect"`, then
   * the value is a list of scope names required for the execution, and
   * the list MAY be empty if authorization does not require a specified
   * scope. For other security scheme themis, the array MUST be empty.
   */
  [name in ValidSecuritySchemeType | string]?: string[];
};

/**
 * Adds metadata to a single tag that is used by the
 * OperationObject. It is not mandatory to have a Tag Object per
 * tag defined in the OperationObject instances.
 */
export interface TagObject {
  /**
   * The name of the tag.
   */
  name: string;
  /**
   * A short description for the tag. [CommonMark
   * syntax](https://spec.commonmark.org/) MAY be used
   * for rich text representation.
   */
  description?: string;
  /**
   * Additional external documentation for this tag.
   */
  externalDocs?: ExternalDocumentationObject;
}

/**
 * This is the root document object of the OpenAPI document.
 */
export interface OpenAPISchema {
  /**
   * This string MUST be the
   * [semantic version number](https://semver.org/spec/v2.0.0.html)
   * of the [OpenAPI Specification version](#versions)
   * that the OpenAPI document uses. The `openapi` field SHOULD be
   * used by tooling specifications and clients to interpret the
   * OpenAPI document.
   */
  openapi: string;
  /**
   * Provides metadata about the API. The metadata MAY be used by
   * tooling as required.
   */
  info: InfoObject;
  /**
   * An array of Server Objects, which provide connectivity
   * information to a target server. If the `servers` property is not
   * provided, or is an empty array, the default value would be a
   * Server Object with a url value of `/`
   */
  servers?: ServerObject[];
  /**
   * The available paths and operations for the API.
   */
  paths: PathsObject;
  /**
   * An element to hold various schemas for the specification.
   */
  components?: ComponentsObject;
  /**
   * A declaration of which security mechanisms can be used across
   * the API. The list of values includes alternative security
   * requirement objects that can be used. Only one of the security
   * requirement objects need to be satisfied to authorize a request.
   * Individual operations can override this definition. To make
   * security optional, an empty security requirement (`{}`) can be
   * included in the array.
   */
  security?: SecurityRequirementObject[];
  /**
   * A list of tags used by the specification with additional
   * metadata. The order of the tags can be used to reflect on their
   * order by the parsing tools. Not all tags that are used by the
   * Operation Object must be declared. The tags that are not
   * declared MAY be organized randomly or based on the tools' logic.
   * Each tag name in the list MUST be unique.
   */
  tags?: TagObject[];
  /**
   * Additional external documentation.
   */
  externalDocs?: ExternalDocumentationObject;
}
