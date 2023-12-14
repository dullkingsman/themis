import { existsSync, NoParamCallback } from 'fs';
import merge from 'ts-deepmerge';
import { pick } from 'lodash';
import * as path from 'path';
import * as fs from 'fs';
import { getPathToAnyCallerInModule, getProjectRoot } from '../utils/misc';
import { Log } from '../utils/logger';
import {
  CallbackObject,
  ComponentsObject,
  ExampleObject,
  ExternalDocumentationObject,
  HeaderObject,
  InfoObject,
  LinkObject,
  MapFor,
  OpenAPISchema,
  ParameterObject,
  PathItemObject,
  PathsObject,
  ReferenceObject,
  RequestBodyObject,
  ResponseObject,
  SchemaObject,
  SecurityRequirementObject,
  SecuritySchemeObject,
  ServerObject,
  TagObject,
} from '../swagger';

/**
 * A configuration object that dictates the behavior of themis.
 */
export interface ThemisConfig {
  /**
   * The path where themis will save specification files.
   */
  docsDir: string;
  /**
   * The prefixes to the names of the specification files that
   * themis produces. By default, it will produce a
   * spec.[version].js file. the 'spec' part is the prefix, and
   * you can configure that to be anything you desire.
   */
  schemaFilePrefix?: string;
}

const LOG_TAG = 'THEMIS';

/**
 * Default configuration for any schema definition.
 */
const defaultConfig: ThemisConfig = {
  docsDir: 'themis',
  schemaFilePrefix: 'spec.',
};

/**
 * The base schema definition class.
 */
export class Themis {
  /**
   * This string MUST be the
   * [semantic version number](https://semver.org/spec/v2.0.0.html)
   * of the [OpenAPI Specification version](#versions)
   * that the OpenAPI document uses. The `openapi` field SHOULD be
   * used by tooling specifications and clients to interpret the
   * OpenAPI document.
   */
  openapi?: string = '3.0.0';
  /**
   * Provides metadata about the API. The metadata MAY be used by
   * tooling as required.
   */
  info: InfoObject;
  /**
   * An array of Server Objects, which provide connectivity
   * information to a target server. If the `servers` property is not
   * provided, or is an empty array, the default value would be a
   * Server Object with an url value of `/`
   */
  servers?: ServerObject[];
  /**
   * The available paths and operations for the API.
   */
  paths: PathsObject = {};
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

  /**
   * The version of the API the schema is written for. This indicates
   * only the first part of the version in the Info Object.
   *
   * E.g. `"v1"`, `"v2"`, `"v3"`, ...
   */
  apiVersion: string;
  /**
   * The location of the file where the schema will be persisted or be
   * loaded from. If the file does not exist with in the specified path
   * it will be created.
   *
   * These files are named in the following format:
   *
   * *specification.[API Version].json*
   */
  schemaFile?: string;

  /**
   * Constructs a new Themis object.
   */
  constructor(apiVersion: string, info: InfoObject, config?: ThemisConfig) {
    this.apiVersion = apiVersion;
    this.info = info;

    const projectRoot = getProjectRoot(getPathToAnyCallerInModule());

    const incomingConfig = require(projectRoot + '/themis.config.json');

    this.prepareFiles(
      apiVersion,
      projectRoot,
      this.checkAndConstructConfig(config ?? incomingConfig),
    );
  }

  /**
   * Returns a data wrapped SchemaObject.
   */
  static data(schema: SchemaObject) {
    return {
      type: 'object',
      properties: {
        data: {
          ...schema,
        },
      },
      required: ['data'],
    };
  }

  /**
   * Returns an error wrapped SchemaObject.
   */
  static error(schema: SchemaObject) {
    return {
      type: 'object',
      properties: {
        error: {
          ...schema,
        },
      },
      required: ['error'],
    };
  }

  /**
   * Remove all the utility fields from the object and shave
   * it down to the OpenAPISchema Object.
   */
  static shaveDownToSpec(spec: Themis) {
    return pick({ ...spec }, [
      'openapi',
      'info',
      'servers',
      'paths',
      'components',
      'security',
      'tags',
      'externalDocs',
    ]);
  }

  /**
   * Remove all the utility fields from the object and shave
   * it down to the OpenAPISchema Object.
   */
  shaveDownToSpec() {
    return Themis.shaveDownToSpec(this);
  }

  /**
   * Loads an OpenAPI specification from a file.
   */
  loadFromFile() {
    try {
      const persistedSpec: OpenAPISchema = require(String(this.schemaFile));

      this.servers = persistedSpec.servers;
      this.externalDocs = persistedSpec.externalDocs;
      this.security = persistedSpec.security;
      this.tags = persistedSpec.tags;
      this.components = persistedSpec.components;
      this.openapi = persistedSpec.openapi;
      this.paths = persistedSpec.paths;
      this.info = persistedSpec.info;
    } catch (err) {
      Log.e(
        `Could not parse specification file for ${this.apiVersion}.`,
        LOG_TAG,
      );
    }
  }

  /**
   * Prepares the files for the api schema.
   * @param apiVersion
   * @param projectRoot
   * @param config
   * @private
   */
  private prepareFiles(
    apiVersion: string,
    projectRoot: string,
    config: ThemisConfig,
  ) {
    const schemaFilePath = `${projectRoot}/${config.docsDir}/${config.schemaFilePrefix}${apiVersion}.json`;

    if (path.extname(schemaFilePath) === '.json')
      this.schemaFile = schemaFilePath;
    else {
      this.schemaFile = '';
      Log.e(`Invalid file type was provided for ${apiVersion}.`, LOG_TAG);
    }

    if (!fs.existsSync(`${projectRoot}/${config.docsDir}/`)) {
      Log.i(`docs/api directory does not exist.`, LOG_TAG);
      Log.i(`Creating "api" directory in "docs".`, LOG_TAG);

      fs.mkdirSync(`${projectRoot}/${config.docsDir}/`, {
        recursive: true,
      });

      Log.s(`Created "api" directory in "docs".`, LOG_TAG);
    }

    if (this.schemaFile === '' || !existsSync(this.schemaFile)) {
      Log.e(`${apiVersion} specification file not found.`, LOG_TAG);

      Log.i(`Creating specification file for ${apiVersion}...`, LOG_TAG);

      fs.writeFile(schemaFilePath, JSON.stringify({}), 'utf8', (err) => {
        if (err) {
          Log.e(`Could not create ${apiVersion} specification file.`, LOG_TAG);

          return console.error(err);
        }

        this.schemaFile = schemaFilePath;
        Log.s(`Created ${apiVersion} specification file.`, LOG_TAG);
      });
    }
  }

  /**
   * It syncs the existing specification object with its
   * corresponding specification the file after the
   * callback is executed.
   */
  private syncWrap(callback?: () => void): void {
    if (!!callback) callback();

    const converted = JSON.stringify({ ...this.shaveDownToSpec() }, null, 2);
    const apiVersion = this.apiVersion;

    if (!!this.schemaFile)
      fs.writeFile(String(this.schemaFile), converted, <NoParamCallback>(
        function (err) {
          Log.i(`Syncing specification ${apiVersion}...`, LOG_TAG);

          if (err) {
            Log.e(`Sync failed for specification ${apiVersion}`, LOG_TAG);
            return console.error(err); //TODO define possible errors
          }

          Log.s(`Sync complete for specification ${apiVersion}.`, LOG_TAG);
        }
      ));
    else Log.i(`Sync for specification ${apiVersion} skipped.`, LOG_TAG);
  }

  private checkAndConstructConfig(config: ThemisConfig) {
    return {
      ...config,
      docsDir:
        Boolean(config.docsDir) && config.docsDir !== defaultConfig.docsDir
          ? config.docsDir
          : defaultConfig.docsDir,
      schemaFilePrefix:
        Boolean(config.schemaFilePrefix) &&
        config.schemaFilePrefix !== defaultConfig.schemaFilePrefix
          ? config.schemaFilePrefix
          : defaultConfig.schemaFilePrefix,
    };
  }

  /**
   * Defines information that is common throughout the specification.
   */
  describe(
    description: Partial<
      Pick<
        Themis,
        'openapi' | 'info' | 'servers' | 'externalDocs' | 'security' | 'tags'
      >
    >,
  ): void {
    this.syncWrap(() => {
      if (description.openapi) this.setOpenapi(description.openapi);
      if (description.info) this.defineInfo(description.info);
      if (description.servers) this.defineServers(description.servers);
      if (description.externalDocs)
        this.defineExternalDocs(description.externalDocs);
      if (description.security)
        this.defineSecurityRequirements(description.security);
      if (description.tags) this.defineTags(description.tags);
    });
  }

  /**
   * Sets the Openapi version.
   */
  setOpenapi(openapi: string) {
    this.openapi = openapi ?? this.openapi;
  }

  /**
   * Sets the info object.
   */
  defineInfo(info: InfoObject): void {
    this.syncWrap(() => {
      this.info = merge(this.info ?? {}, info ?? {});
    });
  }

  /**
   * Defines multiple servers.
   */
  defineServers(servers: Array<ServerObject>) {
    this.syncWrap(() => {
      this.servers = merge({ servers: this.servers ?? [] }, { servers: servers ?? [] }).servers;
    });
  }

  /**
   * Defines a server.
   */
  server(server: ServerObject) {
    this.defineServers([server]);
  }

  /**
   * Defines any external documentations that the api references.
   */
  defineExternalDocs(externalDocs: ExternalDocumentationObject): void {
    this.syncWrap(() => {
      this.externalDocs = merge(this.externalDocs ?? {}, externalDocs ?? {});
    });
  }

  /**
   * Defines multiple security requirements.
   */
  defineSecurityRequirements(
    securityRequirements: Array<SecurityRequirementObject>,
  ): void {
    this.syncWrap(() => {
      this.security = merge({ security: this.security ?? [] }, { security: securityRequirements ?? [] }).security;
    });
  }

  /**
   * Defines a security requirement.
   */
  securityRequirement(securityRequirement: SecurityRequirementObject): void {
    this.defineSecurityRequirements([securityRequirement]);
  }

  /**
   * Defines multiple tags.
   */
  defineTags(tags: Array<TagObject>): void {
    this.syncWrap(() => {
      this.tags = merge({ tags: this.tags ?? [] }, { tags: tags ?? [] }).tags;
    });
  }

  /**
   * Defines multiple paths.
   */
  definePaths(paths: PathsObject): void {
    this.syncWrap(() => {
      this.paths = merge(this.paths ?? {}, paths) as PathsObject;
    });
  }

  /**
   * Defines a path.
   */
  path(path: string, item: PathItemObject): void {
    this.definePaths({ [path]: item });
  }

  /**
   * Defines multiple types of components in a single definition.
   */
  defineComponents(components: ComponentsObject): void {
    this.syncWrap(() => {
      this.components = merge(
        this.components ?? {},
        components,
      ) as ComponentsObject;
    });
  }

  /**
   * Defines multiple callback components.
   */
  defineCallbackComponents(
    callbacks: MapFor<CallbackObject | ReferenceObject>,
  ): void {
    this.syncWrap(() => {
      if (!!this.components)
        this.components.callbacks = merge(
          this.components?.callbacks ?? [],
          callbacks,
        ) as MapFor<CallbackObject | ReferenceObject>;
      else this.components = { callbacks };
    });
  }

  /**
   * Defines a callback component.
   */
  callbackComponent(
    key: string,
    callback: CallbackObject | ReferenceObject,
  ): void {
    this.defineCallbackComponents({ [key]: callback });
  }

  /**
   * Defines multiple example components.
   */
  defineExampleComponents(
    examples: MapFor<ExampleObject | ReferenceObject>,
  ): void {
    this.syncWrap(() => {
      if (!!this.components)
        this.components.examples = merge(
          this.components?.examples ?? [],
          examples,
        );
      else this.components = { examples };
    });
  }

  /**
   * Defines an example component.
   */
  exampleComponent(
    key: string,
    example: ExampleObject | ReferenceObject,
  ): void {
    this.defineExampleComponents({ [key]: example });
  }

  /**
   * Defines multiple header components.
   */
  defineHeaderComponents(
    headers: MapFor<HeaderObject | ReferenceObject>,
  ): void {
    this.syncWrap(() => {
      if (!!this.components)
        this.components.headers = merge(
          this.components?.headers ?? [],
          headers,
        );
      else this.components = { headers };
    });
  }

  /**
   * Defines a header component.
   */
  headerComponent(key: string, header: HeaderObject | ReferenceObject): void {
    this.defineHeaderComponents({ [key]: header });
  }

  /**
   * Defines multiple link components.
   */
  defineLinkComponents(links: MapFor<LinkObject | ReferenceObject>): void {
    this.syncWrap(() => {
      if (!!this.components)
        this.components.links = merge(this.components?.links ?? [], links);
      else this.components = { links };
    });
  }

  /**
   * Defines a link component.
   */
  linkComponent(key: string, link: LinkObject | ReferenceObject): void {
    this.defineLinkComponents({ [key]: link });
  }

  /**
   * Defines multiple parameter components.
   */
  defineParameterComponents(
    parameters: MapFor<ParameterObject | ReferenceObject>,
  ): void {
    this.syncWrap(() => {
      if (!!this.components)
        this.components.parameters = merge(
          this.components?.parameters ?? [],
          parameters,
        );
      else this.components = { parameters };
    });
  }

  /**
   * Defines a parameter component.
   */
  parameterComponent(
    key: string,
    parameter: ParameterObject | ReferenceObject,
  ): void {
    this.defineParameterComponents({ [key]: parameter });
  }

  /**
   * Defines multiple request body components.
   */
  defineRequestBodyComponents(
    requestBodies: MapFor<RequestBodyObject | ReferenceObject>,
  ): void {
    this.syncWrap(() => {
      if (!!this.components)
        this.components.requestBodies = merge(
          this.components?.requestBodies ?? [],
          requestBodies,
        );
      else this.components = { requestBodies };
    });
  }

  /**
   * Defines a request body component.
   */
  requestBodyComponent(
    key: string,
    requestBody: RequestBodyObject | ReferenceObject,
  ): void {
    this.defineRequestBodyComponents({ [key]: requestBody });
  }

  /**
   * Defines multiple response components.
   */
  defineResponseComponents(
    responses: MapFor<ResponseObject | ReferenceObject>,
  ): void {
    this.syncWrap(() => {
      if (!!this.components)
        this.components.responses = merge(
          this.components?.responses ?? [],
          responses,
        );
      else this.components = { responses };
    });
  }

  /**
   * Defines a response component.
   */
  responseComponent(
    key: string,
    response: ResponseObject | ReferenceObject,
  ): void {
    this.defineResponseComponents({ [key]: response });
  }

  /**
   * Defines multiple schema components.
   */
  defineSchemaComponents(
    schemas: MapFor<SchemaObject | ReferenceObject>,
  ): void {
    this.syncWrap(() => {
      if (!!this.components)
        this.components.schemas = merge(
          this.components?.schemas ?? [],
          schemas,
        );
      else this.components = { schemas };
    });
  }

  /**
   * Defines a schema component.
   */
  schemaComponent(key: string, schema: SchemaObject | ReferenceObject): void {
    this.defineSchemaComponents({ [key]: schema });
  }

  /**
   * Defines multiple security scheme components.
   */
  defineSecuritySchemeComponents(
    securitySchemes: MapFor<SecuritySchemeObject | ReferenceObject>,
  ): void {
    this.syncWrap(() => {
      if (!!this.components)
        this.components.securitySchemes = merge(
          this.components?.securitySchemes ?? [],
          securitySchemes,
        );
      else this.components = { securitySchemes };
    });
  }

  /**
   * Defines a security scheme component.
   */
  securitySchemeComponent(
    key: string,
    securityScheme: SecuritySchemeObject | ReferenceObject,
  ): void {
    this.defineSecuritySchemeComponents({ [key]: securityScheme });
  }

  getSchemaComponent(key: string): SchemaObject {
    return (
      !!this?.components?.schemas ? this?.components?.schemas[key] : {}
    ) as SchemaObject;
  }

  getParameterComponent(key: string): ParameterObject {
    return (
      !!this?.components?.parameters ? this?.components?.parameters[key] : {}
    ) as ParameterObject;
  }

  getResponseComponent(key: string): ResponseObject {
    return (
      !!this?.components?.responses ? this?.components?.responses[key] : {}
    ) as ResponseObject;
  }

  getHeaderComponent(key: string): HeaderObject {
    return (
      !!this?.components?.headers ? this?.components?.headers[key] : {}
    ) as HeaderObject;
  }

  getRequestBodyComponent(key: string): RequestBodyObject {
    return (
      !!this?.components?.requestBodies
        ? this?.components?.requestBodies[key]
        : {}
    ) as RequestBodyObject;
  }

  getSecuritySchemeComponent(key: string): SecuritySchemeObject {
    return (
      !!this?.components?.securitySchemes
        ? this?.components?.securitySchemes[key]
        : {}
    ) as SecuritySchemeObject;
  }

  getExampleComponent(key: string): ExampleObject {
    return (
      !!this?.components?.examples ? this?.components?.examples[key] : {}
    ) as ExampleObject;
  }

  getCallbackComponent(key: string): CallbackObject {
    return (
      !!this?.components?.callbacks ? this?.components?.callbacks[key] : {}
    ) as CallbackObject;
  }

  getSchemaComponentRef(schema: string): ReferenceObject {
    return { "$ref": `#/components/schemas/${schema}` };
  }

  getParameterComponentRef(parameter: string): ReferenceObject {
    return { "$ref": `#/components/parameters/${parameter}` };
  }

  getResponseComponentRef(response: string): ReferenceObject {
    return { "$ref": `#/components/responses/${response}` };
  }

  getHeaderComponentRef(Header: string): ReferenceObject {
    return { "$ref": `#/components/headers/${Header}` };
  }

  getRequestBodyComponentRef(requestBody: string): ReferenceObject {
    return { "$ref": `#/components/requestBodies/${requestBody}` };
  }

  getSecuritySchemeComponentRef(securityScheme: string): ReferenceObject {
    return { "$ref": `#/components/securitySchemes/${securityScheme}` };
  }

  getExampleComponentRef(example: string): ReferenceObject {
    return { "$ref": `#/components/examples/${example}` };
  }

  getCallbackComponentRef(callback: string): ReferenceObject {
    return { "$ref": `#/components/callbacks/${callback}` };
  }
}

/**
 * This object defines OpenAPI specs for different versions of
 * the API.
 */
export type APIDefinitions = {
  /**
   * The key for this field is the version of the API being
   * modified — `"v1"`, `"v2"`, `"v3"`, ...
   */
  [version: string]: Themis;
};
