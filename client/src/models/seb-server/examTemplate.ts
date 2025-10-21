type Threshold = {
    value: number; // mandatory, the value of the threshold, range from 0 to 100 (%) for Battery and WiFi
    color: string; // mandatory, hex color value without the "#"
};

type IndicatorTemplate = {
    id?: number; // PK of the IndicatorTemplate only available when the IndicatorTemplate exists
    examTemplateId?: number; // PK reference to the ExamTemplate, only available when the IndicatorTemplate exists
    name: string; // mandatory, min 3 - max 255 chars, name is unique within indicatorTemplates of ExamTemplate
    type: string; // mandatory, type of indicator, enum selection values BATTERY_STATUS | WLAN_STATUS
    thresholds: Threshold[]; // mandatory, list of thresholds, must not be empty
};

type ClientGroupTemplate = {
    id?: number; // PK of the ClientGroupTemplate only available when the ClientGroupTemplate exists
    name: string; // mandatory, min 3 - max 255 chars, name is unique within CLIENT_GROUP_TEMPLATES of ExamTemplate
    type: string; // mandatory, type of client group: "ClientGroupEnum" (do not use SP_FALLBACK_GROUP in selection)
    color?: string; // optional, hex color value without the "#"
    ipRangeStart?: string; // optional (only when type is IP_V4_RANGE), IP address, validate correct IP address format
    ipRangeEnd?: string; // optional (only when type is IP_V4_RANGE), IP address, validate correct IP address format
    clientOS?: string; // optional (only when type is CLIENT_OS), ClientOSEnum value
    nameRangeStartLetter?: string; // optional (mandatory only when type id NAME_ALPHABETICAL_RANGE), no min, max 255, first letter must be before first letter of nameRangeEndLetter
    nameRangeEndLetter?: string; // optional (mandatory only when type id NAME_ALPHABETICAL_RANGE), no min, max 255, first letter must be after first letter of nameRangeStartLetter
};

type ExamAttribute = {
    enableScreenProctoring: string; // mandatory, screen proctoring enabled flag
    spsCollectingStrategy?: string; // mandatory, name of collecting strategy selection: "CollectingStrategyEnum" --> EXAM|APPLY_SEB_GROUPS
    spsCollectingGroupName?: string; // mandatory, min 3 - max 255 chars, name of the collecting of fallback room
    spsCollectingGroupSize?: string; // not used yet, must be null or absent
    spsSEBGroupsSelection?: string; // optional, comma separated list of selected ClientGroupTemplate list indices that are used for screen proctoring. (1)
    quitPassword?: string; // optional, is not used yet, ignore it
};

type ExamTemplate = {
    id?: number; // PK of the ExamTemplate only available when the ExamTemplate exists
    name: string; // mandatory, min 3 - max 255 chars, name is unique for all ExamTemplate (2)
    description?: string; // optional, max 4000 chars, description text
    examType?: string; // optional exam type selection "ExamTypeEnum"
    supporter: string[]; // optional selection of Exam Supporter users (see Exam Wizard on how to fetch the possible users for selection)
    configurationTemplateId?: number; // mandatory, identifier of the the selected configuration template.  (3)
    institutionalDefault: boolean; // mandatory, institutional default flag
    lmsIntegration: boolean; // mandatory, Assessment Tool Integration flag
    clientConfigurationId?: number; // (optional or mandatory?) identifier of the the selected connection configuration. (4)
    indicatorTemplates: IndicatorTemplate[]; // optional list of created IndicatorTemplates
    CLIENT_GROUP_TEMPLATES: ClientGroupTemplate[]; //optional list of created ClientGroupTemplates
    EXAM_ATTRIBUTES: ExamAttribute; // additional exam attributes see ExamAttribute
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ExamTemplates = {
    number_of_pages: number;
    page_number: number;
    page_size: number;
    content: ExamTemplate[];
};

// (1)  spsSEBGroupsSelection: In the Wizard within the Screen Proctoring selection there is the type selection. This only is needed when the type selection is "APPLY_SEB_GROUPS"
//      In this case the Wizard should show existing ClientGroupTemplates in a list for selection. The system should then store the indices of the selected ClientGroupTemplates from
// 	    the original ClientGroupTemplates list as a comma separated sting into "spsSEBGroupsSelection"

// (2)  The uniqueness of the name of an ExamTemplate can be checked by fetching all existing ExamTemplate names with:
//      "GET: .../admin-api/v1/exam-template/names" to get a list of entity key pair like:
// 	[
// 		{
// 			"modelId": "1",
// 			"entityType": "EXAM_TEMPLATE",
// 			"name": "Exam Template 1"
// 		}
// 	]
//  Use the names of all fetched entries to check uniqueness (reduce it to a set of names where you can check, for example)

// (3) configurationTemplateId: This is the id of the selected configuration template. To get a list of all ConfigurationTemplates for selection use API call
//     "GET .../admin-api/v1/configuration-node/names?type=TEMPLATE&active=true" to get a list of entity key pair like:
// 	[
// 		{
// 			"modelId": "4",
// 			"entityType": "CONFIGURATION_NODE",
// 			"name": "Config Template 1"
// 		}
// 	]
// 	Use modelId and name for selection and use modelId as id of selected configurationTemplateId

// (4) clientConfigurationId:  This is the id of the selected client configuration. To get a list of all client configurations for selection use API call
//     "GET .../admin-api/v1/client_configuration/names?active=true" to get a list of entity key pair like:
// 	[
// 	  {
// 		"modelId": "1",
// 		"entityType": "SEB_CLIENT_CONFIGURATION",
// 		"name": "test"
// 	  }
// 	]
// 	Use modelId and name for selection and use modelId as id of selected configurationTemplateId
