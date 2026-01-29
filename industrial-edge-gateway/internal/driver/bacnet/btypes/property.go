package btypes

import (
	"bytes"
	"fmt"
	"strings"
)

const defaultSpacing = 4

type PropertyType uint32

const (
	PropAllProperties                PropertyType = 8
	PropDescription                  PropertyType = 28
	PropFileSize                     PropertyType = 42
	PropFileType                     PropertyType = 43
	PropModelName                    PropertyType = 70
	PropObjectIdentifier             PropertyType = 75
	PropObjectList                   PropertyType = 76
	PropObjectName                   PropertyType = 77
	PropObjectReference              PropertyType = 78
	PropObjectType                   PropertyType = 79
	PropPresentValue                 PropertyType = 85
	PropUnits                        PropertyType = 117
	PropReliability                  PropertyType = 103
	PropPriorityArray                PropertyType = 87
	PropStatusFlags                  PropertyType = 111
	PropPolarity                     PropertyType = 84
	PropSystemStatus                 PropertyType = 112
	PropMaxAPDU                      PropertyType = 62
	PropSegmentationSupported        PropertyType = 107
	PropVendorName                   PropertyType = 121
	PropVendorIdentifier             PropertyType = 120
	PropProtocolObjectTypesSupported PropertyType = 96
	ProtocolServicesSupported        PropertyType = 97

	//from github.com/bacnet-stack/bacnet-stack
	PROP_ACKED_TRANSITIONS                  PropertyType = 0
	PROP_ACK_REQUIRED                       PropertyType = 1
	PROP_ACTION                             PropertyType = 2
	PROP_ACTION_TEXT                        PropertyType = 3
	PROP_ACTIVE_TEXT                        PropertyType = 4
	PROP_ACTIVE_VT_SESSIONS                 PropertyType = 5
	PROP_ALARM_VALUE                        PropertyType = 6
	PROP_ALARM_VALUES                       PropertyType = 7
	PROP_ALL                                PropertyType = 8
	PROP_ALL_WRITES_SUCCESSFUL              PropertyType = 9
	PROP_APDU_SEGMENT_TIMEOUT               PropertyType = 10
	PROP_APDU_TIMEOUT                       PropertyType = 11
	PROP_APPLICATION_SOFTWARE_VERSION       PropertyType = 12
	PROP_ARCHIVE                            PropertyType = 13
	PROP_BIAS                               PropertyType = 14
	PROP_CHANGE_OF_STATE_COUNT              PropertyType = 15
	PROP_CHANGE_OF_STATE_TIME               PropertyType = 16
	PROP_NOTIFICATION_CLASS                 PropertyType = 17
	PROP_BLANK_1                            PropertyType = 18
	PROP_CONTROLLED_VARIABLE_REFERENCE      PropertyType = 19
	PROP_CONTROLLED_VARIABLE_Propertybtypes PropertyType = 20
	PROP_CONTROLLED_VARIABLE_VALUE          PropertyType = 21
	PROP_COV_INCREMENT                      PropertyType = 22
	PROP_DATE_LIST                          PropertyType = 23
	PROP_DAYLIGHT_SAVINGS_STATUS            PropertyType = 24
	PROP_DEADBAND                           PropertyType = 25
	PROP_DERIVATIVE_CONSTANT                PropertyType = 26
	PROP_DERIVATIVE_CONSTANT_Propertybtypes PropertyType = 27
	PROP_DESCRIPTION                        PropertyType = 28
	PROP_DESCRIPTION_OF_HALT                PropertyType = 29
	PROP_DEVICE_ADDRESS_BINDING             PropertyType = 30
	PROP_DEVICE_TYPE                        PropertyType = 31
	PROP_EFFECTIVE_PERIOD                   PropertyType = 32
	PROP_ELAPSED_ACTIVE_TIME                PropertyType = 33
	PROP_ERROR_LIMIT                        PropertyType = 34
	PROP_EVENT_ENABLE                       PropertyType = 35
	PROP_EVENT_STATE                        PropertyType = 36
	PROP_EVENT_TYPE                         PropertyType = 37
	PROP_EXCEPTION_SCHEDULE                 PropertyType = 38
	PROP_FAULT_VALUES                       PropertyType = 39
	PROP_FEEDBACK_VALUE                     PropertyType = 40
	PROP_FILE_ACCESS_METHOD                 PropertyType = 41
	PROP_FILE_SIZE                          PropertyType = 42
	PROP_FILE_TYPE                          PropertyType = 43
	PROP_FIRMWARE_REVISION                  PropertyType = 44
	PROP_HIGH_LIMIT                         PropertyType = 45
	PROP_INACTIVE_TEXT                      PropertyType = 46
	PROP_IN_PROCESS                         PropertyType = 47
	PROP_INSTANCE_OF                        PropertyType = 48
	PROP_INTEGRAL_CONSTANT                  PropertyType = 49
	PROP_INTEGRAL_CONSTANT_Propertybtypes   PropertyType = 50
	PROP_ISSUE_CONFIRMED_NOTIFICATIONS      PropertyType = 51
	PROP_LIMIT_ENABLE                       PropertyType = 52
	PROP_LIST_OF_GROUP_MEMBERS              PropertyType = 53
	PROP_LIST_OF_OBJECT_PROPERTY_REFERENCES PropertyType = 54
	PROP_LIST_OF_SESSION_KEYS               PropertyType = 55
	PROP_LOCAL_DATE                         PropertyType = 56
	PROP_LOCAL_TIME                         PropertyType = 57
	PROP_LOCATION                           PropertyType = 58
	PROP_LOW_LIMIT                          PropertyType = 59
	PROP_MANIPULATED_VARIABLE_REFERENCE     PropertyType = 60
	PROP_MAXIMUM_OUTPUT                     PropertyType = 61

	PROP_MAX_INFO_FRAMES                      PropertyType = 63
	PROP_MAX_MASTER                           PropertyType = 64
	PROP_MAX_PRES_VALUE                       PropertyType = 65
	PROP_MINIMUM_OFF_TIME                     PropertyType = 66
	PROP_MINIMUM_ON_TIME                      PropertyType = 67
	PROP_MINIMUM_OUTPUT                       PropertyType = 68
	PROP_MIN_PRES_VALUE                       PropertyType = 69
	PROP_MODEL_NAME                           PropertyType = 70
	PROP_MODIFICATION_DATE                    PropertyType = 71
	PROP_NOTIFY_TYPE                          PropertyType = 72
	PROP_NUMBER_OF_APDU_RETRIES               PropertyType = 73
	PROP_NUMBER_OF_STATES                     PropertyType = 74
	PROP_OBJECT_IDENTIFIER                    PropertyType = 75
	PROP_OBJECT_LIST                          PropertyType = 76
	PROP_OBJECT_NAME                          PropertyType = 77
	PROP_OBJECT_PROPERTY_REFERENCE            PropertyType = 78
	PROP_OBJECT_TYPE                          PropertyType = 79
	PROP_OPTIONAL                             PropertyType = 80
	PROP_OUT_OF_SERVICE                       PropertyType = 81
	PROP_OUTPUT_Propertybtypes                PropertyType = 82
	PROP_EVENT_PARAMETERS                     PropertyType = 83
	PROP_POLARITY                             PropertyType = 84
	PROP_PRESENT_VALUE                        PropertyType = 85
	PROP_PRIORITY                             PropertyType = 86
	PROP_PRIORITY_ARRAY                       PropertyType = 87
	PROP_PRIORITY_FOR_WRITING                 PropertyType = 88
	PROP_PROCESS_IDENTIFIER                   PropertyType = 89
	PROP_PROGRAM_CHANGE                       PropertyType = 90
	PROP_PROGRAM_LOCATION                     PropertyType = 91
	PROP_PROGRAM_STATE                        PropertyType = 92
	PROP_PROPORTIONAL_CONSTANT                PropertyType = 93
	PROP_PROPORTIONAL_CONSTANT_Propertybtypes PropertyType = 94
	PROP_PROTOCOL_CONFORMANCE_CLASS           PropertyType = 95 /* deleted in version 1 revision 2 */

	PROP_PROTOCOL_VERSION   PropertyType = 98
	PROP_READ_ONLY          PropertyType = 99
	PROP_REASON_FOR_HALT    PropertyType = 100
	PROP_RECIPIENT          PropertyType = 101
	PROP_RECIPIENT_LIST     PropertyType = 102
	PROP_RELIABILITY        PropertyType = 103
	PROP_RELINQUISH_DEFAULT PropertyType = 104
	PROP_REQUIRED           PropertyType = 105
	PROP_RESOLUTION         PropertyType = 106

	PROP_SETPOINT                        PropertyType = 108
	PROP_SETPOINT_REFERENCE              PropertyType = 109
	PROP_STATE_TEXT                      PropertyType = 110
	PROP_STATUS_FLAGS                    PropertyType = 111
	PROP_SYSTEM_STATUS                   PropertyType = 112
	PROP_TIME_DELAY                      PropertyType = 113
	PROP_TIME_OF_ACTIVE_TIME_RESET       PropertyType = 114
	PROP_TIME_OF_STATE_COUNT_RESET       PropertyType = 115
	PROP_TIME_SYNCHRONIZATION_RECIPIENTS PropertyType = 116
	PROP_Propertybtypes                  PropertyType = 117
	PROP_UPDATE_INTERVAL                 PropertyType = 118
	PROP_UTC_OFFSET                      PropertyType = 119
	PROP_VENDOR_IDENTIFIER               PropertyType = 120

	PROP_VT_CLASSES_SUPPORTED        PropertyType = 122
	PROP_WEEKLY_SCHEDULE             PropertyType = 123
	PROP_ATTEMPTED_SAMPLES           PropertyType = 124
	PROP_AVERAGE_VALUE               PropertyType = 125
	PROP_BUFFER_SIZE                 PropertyType = 126
	PROP_CLIENT_COV_INCREMENT        PropertyType = 127
	PROP_COV_RESUBSCRIPTION_INTERVAL PropertyType = 128
	PROP_CURRENT_NOTIFY_TIME         PropertyType = 129
	PROP_EVENT_TIME_STAMPS           PropertyType = 130
	PROP_LOG_BUFFER                  PropertyType = 131
	PROP_LOG_DEVICE_OBJECT_PROPERTY  PropertyType = 132
	/* The enable property is renamed from log-enable in
	   Addendum b to ANSI/ASHRAE 135-2004(135b-2) */
	PROP_ENABLE                       PropertyType = 133
	PROP_LOG_INTERVAL                 PropertyType = 134
	PROP_MAXIMUM_VALUE                PropertyType = 135
	PROP_MINIMUM_VALUE                PropertyType = 136
	PROP_NOTIFICATION_THRESHOLD       PropertyType = 137
	PROP_PREVIOUS_NOTIFY_TIME         PropertyType = 138
	PROP_PROTOCOL_REVISION            PropertyType = 139
	PROP_RECORDS_SINCE_NOTIFICATION   PropertyType = 140
	PROP_RECORD_COUNT                 PropertyType = 141
	PROP_START_TIME                   PropertyType = 142
	PROP_STOP_TIME                    PropertyType = 143
	PROP_STOP_WHEN_FULL               PropertyType = 144
	PROP_TOTAL_RECORD_COUNT           PropertyType = 145
	PROP_VALID_SAMPLES                PropertyType = 146
	PROP_WINDOW_INTERVAL              PropertyType = 147
	PROP_WINDOW_SAMPLES               PropertyType = 148
	PROP_MAXIMUM_VALUE_TIMESTAMP      PropertyType = 149
	PROP_MINIMUM_VALUE_TIMESTAMP      PropertyType = 150
	PROP_VARIANCE_VALUE               PropertyType = 151
	PROP_ACTIVE_COV_SUBSCRIPTIONS     PropertyType = 152
	PROP_BACKUP_FAILURE_TIMEOUT       PropertyType = 153
	PROP_CONFIGURATION_FILES          PropertyType = 154
	PROP_DATABASE_REVISION            PropertyType = 155
	PROP_DIRECT_READING               PropertyType = 156
	PROP_LAST_RESTORE_TIME            PropertyType = 157
	PROP_MAINTENANCE_REQUIRED         PropertyType = 158
	PROP_MEMBER_OF                    PropertyType = 159
	PROP_MODE                         PropertyType = 160
	PROP_OPERATION_EXPECTED           PropertyType = 161
	PROP_SETTING                      PropertyType = 162
	PROP_SILENCED                     PropertyType = 163
	PROP_TRACKING_VALUE               PropertyType = 164
	PROP_ZONE_MEMBERS                 PropertyType = 165
	PROP_LIFE_SAFETY_ALARM_VALUES     PropertyType = 166
	PROP_MAX_SEGMENTS_ACCEPTED        PropertyType = 167
	PROP_PROFILE_NAME                 PropertyType = 168
	PROP_AUTO_SLAVE_DISCOVERY         PropertyType = 169
	PROP_MANUAL_SLAVE_ADDRESS_BINDING PropertyType = 170
	PROP_SLAVE_ADDRESS_BINDING        PropertyType = 171
	PROP_SLAVE_PROXY_ENABLE           PropertyType = 172
	PROP_LAST_NOTIFY_RECORD           PropertyType = 173
	PROP_SCHEDULE_DEFAULT             PropertyType = 174
	PROP_ACCEPTED_MODES               PropertyType = 175
	PROP_ADJUST_VALUE                 PropertyType = 176
	PROP_COUNT                        PropertyType = 177
	PROP_COUNT_BEFORE_CHANGE          PropertyType = 178
	PROP_COUNT_CHANGE_TIME            PropertyType = 179
	PROP_COV_PERIOD                   PropertyType = 180
	PROP_INPUT_REFERENCE              PropertyType = 181
	PROP_LIMIT_MONITORING_INTERVAL    PropertyType = 182
	PROP_LOGGING_OBJECT               PropertyType = 183
	PROP_LOGGING_RECORD               PropertyType = 184
	PROP_PRESCALE                     PropertyType = 185
	PROP_PULSE_RATE                   PropertyType = 186
	PROP_SCALE                        PropertyType = 187
	PROP_SCALE_FACTOR                 PropertyType = 188
	PROP_UPDATE_TIME                  PropertyType = 189
	PROP_VALUE_BEFORE_CHANGE          PropertyType = 190
	PROP_VALUE_SET                    PropertyType = 191
	PROP_VALUE_CHANGE_TIME            PropertyType = 192
	/* enumerations 193-206 are new */
	PROP_ALIGN_INTERVALS PropertyType = 193
	/* enumeration 194 is unassigned */
	PROP_INTERVAL_OFFSET     PropertyType = 195
	PROP_LAST_RESTART_REASON PropertyType = 196
	PROP_LOGGING_TYPE        PropertyType = 197
	/* enumeration 198-201 is unassigned */
	PROP_RESTART_NOTIFICATION_RECIPIENTS     PropertyType = 202
	PROP_TIME_OF_DEVICE_RESTART              PropertyType = 203
	PROP_TIME_SYNCHRONIZATION_INTERVAL       PropertyType = 204
	PROP_TRIGGER                             PropertyType = 205
	PROP_UTC_TIME_SYNCHRONIZATION_RECIPIENTS PropertyType = 206
	/* enumerations 207-211 are used in Addendum d to ANSI/ASHRAE 135-2004 */
	PROP_NODE_SUBTYPE            PropertyType = 207
	PROP_NODE_TYPE               PropertyType = 208
	PROP_STRUCTURED_OBJECT_LIST  PropertyType = 209
	PROP_SUBORDINATE_ANNOTATIONS PropertyType = 210
	PROP_SUBORDINATE_LIST        PropertyType = 211
	/* enumerations 212-225 are used in Addendum e to ANSI/ASHRAE 135-2004 */
	PROP_ACTUAL_SHED_LEVEL   PropertyType = 212
	PROP_DUTY_WINDOW         PropertyType = 213
	PROP_EXPECTED_SHED_LEVEL PropertyType = 214
	PROP_FULL_DUTY_BASELINE  PropertyType = 215
	/* enumerations 216-217 are unassigned */
	/* enumerations 212-225 are used in Addendum e to ANSI/ASHRAE 135-2004 */
	PROP_REQUESTED_SHED_LEVEL    PropertyType = 218
	PROP_SHED_DURATION           PropertyType = 219
	PROP_SHED_LEVEL_DESCRIPTIONS PropertyType = 220
	PROP_SHED_LEVELS             PropertyType = 221
	PROP_STATE_DESCRIPTION       PropertyType = 222
	/* enumerations 223-225 are unassigned  */
	/* enumerations 226-235 are used in Addendum f to ANSI/ASHRAE 135-2004 */
	PROP_DOOR_ALARM_STATE         PropertyType = 226
	PROP_DOOR_EXTENDED_PULSE_TIME PropertyType = 227
	PROP_DOOR_MEMBERS             PropertyType = 228
	PROP_DOOR_OPEN_TOO_LONG_TIME  PropertyType = 229
	PROP_DOOR_PULSE_TIME          PropertyType = 230
	PROP_DOOR_STATUS              PropertyType = 231
	PROP_DOOR_UNLOCK_DELAY_TIME   PropertyType = 232
	PROP_LOCK_STATUS              PropertyType = 233
	PROP_MASKED_ALARM_VALUES      PropertyType = 234
	PROP_SECURED_STATUS           PropertyType = 235
	/* enumerations 236-243 are unassigned  */
	/* enumerations 244-311 are used in Addendum j to ANSI/ASHRAE 135-2004 */
	PROP_ABSENTEE_LIMIT                     PropertyType = 244
	PROP_ACCESS_ALARM_EVENTS                PropertyType = 245
	PROP_ACCESS_DOORS                       PropertyType = 246
	PROP_ACCESS_EVENT                       PropertyType = 247
	PROP_ACCESS_EVENT_AUTHENTICATION_FACTOR PropertyType = 248
	PROP_ACCESS_EVENT_CREDENTIAL            PropertyType = 249
	PROP_ACCESS_EVENT_TIME                  PropertyType = 250
	PROP_ACCESS_TRANSACTION_EVENTS          PropertyType = 251
	PROP_ACCOMPANIMENT                      PropertyType = 252
	PROP_ACCOMPANIMENT_TIME                 PropertyType = 253
	PROP_ACTIVATION_TIME                    PropertyType = 254
	PROP_ACTIVE_AUTHENTICATION_POLICY       PropertyType = 255
	PROP_ASSIGNED_ACCESS_RIGHTS             PropertyType = 256
	PROP_AUTHENTICATION_FACTORS             PropertyType = 257
	PROP_AUTHENTICATION_POLICY_LIST         PropertyType = 258
	PROP_AUTHENTICATION_POLICY_NAMES        PropertyType = 259
	PROP_AUTHENTICATION_STATUS              PropertyType = 260
	PROP_AUTHORIZATION_MODE                 PropertyType = 261
	PROP_BELONGS_TO                         PropertyType = 262
	PROP_CREDENTIAL_DISABLE                 PropertyType = 263
	PROP_CREDENTIAL_STATUS                  PropertyType = 264
	PROP_CREDENTIALS                        PropertyType = 265
	PROP_CREDENTIALS_IN_ZONE                PropertyType = 266
	PROP_DAYS_REMAINING                     PropertyType = 267
	PROP_ENTRY_POINTS                       PropertyType = 268
	PROP_EXIT_POINTS                        PropertyType = 269
	PROP_EXPIRATION_TIME                    PropertyType = 270
	PROP_EXTENDED_TIME_ENABLE               PropertyType = 271
	PROP_FAILED_ATTEMPT_EVENTS              PropertyType = 272
	PROP_FAILED_ATTEMPTS                    PropertyType = 273
	PROP_FAILED_ATTEMPTS_TIME               PropertyType = 274
	PROP_LAST_ACCESS_EVENT                  PropertyType = 275
	PROP_LAST_ACCESS_POINT                  PropertyType = 276
	PROP_LAST_CREDENTIAL_ADDED              PropertyType = 277
	PROP_LAST_CREDENTIAL_ADDED_TIME         PropertyType = 278
	PROP_LAST_CREDENTIAL_REMOVED            PropertyType = 279
	PROP_LAST_CREDENTIAL_REMOVED_TIME       PropertyType = 280
	PROP_LAST_USE_TIME                      PropertyType = 281
	PROP_LOCKOUT                            PropertyType = 282
	PROP_LOCKOUT_RELINQUISH_TIME            PropertyType = 283
	PROP_MASTER_EXEMPTION                   PropertyType = 284
	PROP_MAX_FAILED_ATTEMPTS                PropertyType = 285
	PROP_MEMBERS                            PropertyType = 286
	PROP_MUSTER_POINT                       PropertyType = 287
	PROP_NEGATIVE_ACCESS_RULES              PropertyType = 288
	PROP_NUMBER_OF_AUTHENTICATION_POLICIES  PropertyType = 289
	PROP_OCCUPANCY_COUNT                    PropertyType = 290
	PROP_OCCUPANCY_COUNT_ADJUST             PropertyType = 291
	PROP_OCCUPANCY_COUNT_ENABLE             PropertyType = 292
	PROP_OCCUPANCY_EXEMPTION                PropertyType = 293
	PROP_OCCUPANCY_LOWER_LIMIT              PropertyType = 294
	PROP_OCCUPANCY_LOWER_LIMIT_ENFORCED     PropertyType = 295
	PROP_OCCUPANCY_STATE                    PropertyType = 296
	PROP_OCCUPANCY_UPPER_LIMIT              PropertyType = 297
	PROP_OCCUPANCY_UPPER_LIMIT_ENFORCED     PropertyType = 298
	PROP_PASSBACK_EXEMPTION                 PropertyType = 299
	PROP_PASSBACK_MODE                      PropertyType = 300
	PROP_PASSBACK_TIMEOUT                   PropertyType = 301
	PROP_POSITIVE_ACCESS_RULES              PropertyType = 302
	PROP_REASON_FOR_DISABLE                 PropertyType = 303
	PROP_SUPPORTED_FORMATS                  PropertyType = 304
	PROP_SUPPORTED_FORMAT_CLASSES           PropertyType = 305
	PROP_THREAT_AUTHORITY                   PropertyType = 306
	PROP_THREAT_LEVEL                       PropertyType = 307
	PROP_TRACE_FLAG                         PropertyType = 308
	PROP_TRANSACTION_NOTIFICATION_CLASS     PropertyType = 309
	PROP_USER_EXTERNAL_IDENTIFIER           PropertyType = 310
	PROP_USER_INFORMATION_REFERENCE         PropertyType = 311
	/* enumerations 312-316 are unassigned */
	PROP_USER_NAME         PropertyType = 317
	PROP_USER_TYPE         PropertyType = 318
	PROP_USES_REMAINING    PropertyType = 319
	PROP_ZONE_FROM         PropertyType = 320
	PROP_ZONE_TO           PropertyType = 321
	PROP_ACCESS_EVENT_TAG  PropertyType = 322
	PROP_GLOBAL_IDENTIFIER PropertyType = 323
	/* enumerations 324-325 are unassigned */
	PROP_VERIFICATION_TIME                PropertyType = 326
	PROP_BASE_DEVICE_SECURITY_POLICY      PropertyType = 327
	PROP_DISTRIBUTION_KEY_REVISION        PropertyType = 328
	PROP_DO_NOT_HIDE                      PropertyType = 329
	PROP_KEY_SETS                         PropertyType = 330
	PROP_LAST_KEY_SERVER                  PropertyType = 331
	PROP_NETWORK_ACCESS_SECURITY_POLICIES PropertyType = 332
	PROP_PACKET_REORDER_TIME              PropertyType = 333
	PROP_SECURITY_PDU_TIMEOUT             PropertyType = 334
	PROP_SECURITY_TIME_WINDOW             PropertyType = 335
	PROP_SUPPORTED_SECURITY_ALGORITHM     PropertyType = 336
	PROP_UPDATE_KEY_SET_TIMEOUT           PropertyType = 337
	PROP_BACKUP_AND_RESTORE_STATE         PropertyType = 338
	PROP_BACKUP_PREPARATION_TIME          PropertyType = 339
	PROP_RESTORE_COMPLETION_TIME          PropertyType = 340
	PROP_RESTORE_PREPARATION_TIME         PropertyType = 341
	/* enumerations 342-344 are defined in Addendum 2008-w */
	PROP_BIT_MASK                  PropertyType = 342
	PROP_BIT_TEXT                  PropertyType = 343
	PROP_IS_UTC                    PropertyType = 344
	PROP_GROUP_MEMBERS             PropertyType = 345
	PROP_GROUP_MEMBER_NAMES        PropertyType = 346
	PROP_MEMBER_STATUS_FLAGS       PropertyType = 347
	PROP_REQUESTED_UPDATE_INTERVAL PropertyType = 348
	PROP_COVU_PERIOD               PropertyType = 349
	PROP_COVU_RECIPIENTS           PropertyType = 350
	PROP_EVENT_MESSAGE_TEXTS       PropertyType = 351
	/* enumerations 352-363 are defined in Addendum 2010-af */
	PROP_EVENT_MESSAGE_TEXTS_CONFIG     PropertyType = 352
	PROP_EVENT_DETECTION_ENABLE         PropertyType = 353
	PROP_EVENT_ALGORITHM_INHIBIT        PropertyType = 354
	PROP_EVENT_ALGORITHM_INHIBIT_REF    PropertyType = 355
	PROP_TIME_DELAY_NORMAL              PropertyType = 356
	PROP_RELIABILITY_EVALUATION_INHIBIT PropertyType = 357
	PROP_FAULT_PARAMETERS               PropertyType = 358
	PROP_FAULT_TYPE                     PropertyType = 359
	PROP_LOCAL_FORWARDING_ONLY          PropertyType = 360
	PROP_PROCESS_IDENTIFIER_FILTER      PropertyType = 361
	PROP_SUBSCRIBED_RECIPIENTS          PropertyType = 362
	PROP_PORT_FILTER                    PropertyType = 363
	/* enumeration 364 is defined in Addendum 2010-ae */
	PROP_AUTHORIZATION_EXEMPTIONS PropertyType = 364
	/* enumerations 365-370 are defined in Addendum 2010-aa */
	PROP_ALLOW_GROUP_DELAY_INHIBIT PropertyType = 365
	PROP_CHANNEL_NUMBER            PropertyType = 366
	PROP_CONTROL_GROUPS            PropertyType = 367
	PROP_EXECUTION_DELAY           PropertyType = 368
	PROP_LAST_PRIORITY             PropertyType = 369
	PROP_WRITE_STATUS              PropertyType = 370
	/* enumeration 371 is defined in Addendum 2010-ao */
	PROP_PROPERTY_LIST PropertyType = 371
	/* enumeration 372 is defined in Addendum 2010-ak */
	PROP_SERIAL_NUMBER PropertyType = 372
	/* enumerations 373-386 are defined in Addendum 2010-i */
	PROP_BLINK_WARN_ENABLE                 PropertyType = 373
	PROP_DEFAULT_FADE_TIME                 PropertyType = 374
	PROP_DEFAULT_RAMP_RATE                 PropertyType = 375
	PROP_DEFAULT_STEP_INCREMENT            PropertyType = 376
	PROP_EGRESS_TIME                       PropertyType = 377
	PROP_IN_PROGRESS                       PropertyType = 378
	PROP_INSTANTANEOUS_POWER               PropertyType = 379
	PROP_LIGHTING_COMMAND                  PropertyType = 380
	PROP_LIGHTING_COMMAND_DEFAULT_PRIORITY PropertyType = 381
	PROP_MAX_ACTUAL_VALUE                  PropertyType = 382
	PROP_MIN_ACTUAL_VALUE                  PropertyType = 383
	PROP_POWER                             PropertyType = 384
	PROP_TRANSITION                        PropertyType = 385
	PROP_EGRESS_ACTIVE                     PropertyType = 386
	/* enumerations 387-398 */
	PROP_INTERFACE_VALUE            PropertyType = 387
	PROP_FAULT_HIGH_LIMIT           PropertyType = 388
	PROP_FAULT_LOW_LIMIT            PropertyType = 389
	PROP_LOW_DIFF_LIMIT             PropertyType = 390
	PROP_STRIKE_COUNT               PropertyType = 391
	PROP_TIME_OF_STRIKE_COUNT_RESET PropertyType = 392
	PROP_DEFAULT_TIMEOUT            PropertyType = 393
	PROP_INITIAL_TIMEOUT            PropertyType = 394
	PROP_LAST_STATE_CHANGE          PropertyType = 395
	PROP_STATE_CHANGE_VALUES        PropertyType = 396
	PROP_TIMER_RUNNING              PropertyType = 397
	PROP_TIMER_STATE                PropertyType = 398
	/* enumerations 399-427 are defined in Addendum 2012-ai */
	PROP_APDU_LENGTH                       PropertyType = 399
	PROP_IP_ADDRESS                        PropertyType = 400
	PROP_IP_DEFAULT_GATEWAY                PropertyType = 401
	PROP_IP_DHCP_ENABLE                    PropertyType = 402
	PROP_IP_DHCP_LEASE_TIME                PropertyType = 403
	PROP_IP_DHCP_LEASE_TIME_REMAINING      PropertyType = 404
	PROP_IP_DHCP_SERVER                    PropertyType = 405
	PROP_IP_DNS_SERVER                     PropertyType = 406
	PROP_BACNET_IP_GLOBAL_ADDRESS          PropertyType = 407
	PROP_BACNET_IP_MODE                    PropertyType = 408
	PROP_BACNET_IP_MULTICAST_ADDRESS       PropertyType = 409
	PROP_BACNET_IP_NAT_TRAVERSAL           PropertyType = 410
	PROP_IP_SUBNET_MASK                    PropertyType = 411
	PROP_BACNET_IP_UDP_PORT                PropertyType = 412
	PROP_BBMD_ACCEPT_FD_REGISTRATIONS      PropertyType = 413
	PROP_BBMD_BROADCAST_DISTRIBUTION_TABLE PropertyType = 414
	PROP_BBMD_FOREIGN_DEVICE_TABLE         PropertyType = 415
	PROP_CHANGES_PENDING                   PropertyType = 416
	PROP_COMMAND                           PropertyType = 417
	PROP_FD_BBMD_ADDRESS                   PropertyType = 418
	PROP_FD_SUBSCRIPTION_LIFETIME          PropertyType = 419
	PROP_LINK_SPEED                        PropertyType = 420
	PROP_LINK_SPEEDS                       PropertyType = 421
	PROP_LINK_SPEED_AUTONEGOTIATE          PropertyType = 422
	PROP_MAC_ADDRESS                       PropertyType = 423
	PROP_NETWORK_INTERFACE_NAME            PropertyType = 424
	PROP_NETWORK_NUMBER                    PropertyType = 425
	PROP_NETWORK_NUMBER_QUALITY            PropertyType = 426
	PROP_NETWORK_TYPE                      PropertyType = 427
	PROP_ROUTING_TABLE                     PropertyType = 428
	PROP_VIRTUAL_MAC_ADDRESS_TABLE         PropertyType = 429
	/* enumerations 430-491 */
	PROP_COMMAND_TIME_ARRAY             PropertyType = 430
	PROP_CURRENT_COMMAND_PRIORITY       PropertyType = 431
	PROP_LAST_COMMAND_TIME              PropertyType = 432
	PROP_VALUE_SOURCE                   PropertyType = 433
	PROP_VALUE_SOURCE_ARRAY             PropertyType = 434
	PROP_BACNET_IPV6_MODE               PropertyType = 435
	PROP_IPV6_ADDRESS                   PropertyType = 436
	PROP_IPV6_PREFIX_LENGTH             PropertyType = 437
	PROP_BACNET_IPV6_UDP_PORT           PropertyType = 438
	PROP_IPV6_DEFAULT_GATEWAY           PropertyType = 439
	PROP_BACNET_IPV6_MULTICAST_ADDRESS  PropertyType = 440
	PROP_IPV6_DNS_SERVER                PropertyType = 441
	PROP_IPV6_AUTO_ADDRESSING_ENABLE    PropertyType = 442
	PROP_IPV6_DHCP_LEASE_TIME           PropertyType = 443
	PROP_IPV6_DHCP_LEASE_TIME_REMAINING PropertyType = 444
	PROP_IPV6_DHCP_SERVER               PropertyType = 445
	PROP_IPV6_ZONE_INDEX                PropertyType = 446
	PROP_ASSIGNED_LANDING_CALLS         PropertyType = 447
	PROP_CAR_ASSIGNED_DIRECTION         PropertyType = 448
	PROP_CAR_DOOR_COMMAND               PropertyType = 449
	PROP_CAR_DOOR_STATUS                PropertyType = 450
	PROP_CAR_DOOR_TEXT                  PropertyType = 451
	PROP_CAR_DOOR_ZONE                  PropertyType = 452
	PROP_CAR_DRIVE_STATUS               PropertyType = 453
	PROP_CAR_LOAD                       PropertyType = 454
	PROP_CAR_LOAD_Propertybtypes        PropertyType = 455
	PROP_CAR_MODE                       PropertyType = 456
	PROP_CAR_MOVING_DIRECTION           PropertyType = 457
	PROP_CAR_POSITION                   PropertyType = 458
	PROP_ELEVATOR_GROUP                 PropertyType = 459
	PROP_ENERGY_METER                   PropertyType = 460
	PROP_ENERGY_METER_REF               PropertyType = 461
	PROP_ESCALATOR_MODE                 PropertyType = 462
	PROP_FAULT_SIGNALS                  PropertyType = 463
	PROP_FLOOR_TEXT                     PropertyType = 464
	PROP_GROUP_ID                       PropertyType = 465
	/* value 466 is unassigned */
	PROP_GROUP_MODE                        PropertyType = 467
	PROP_HIGHER_DECK                       PropertyType = 468
	PROP_INSTALLATION_ID                   PropertyType = 469
	PROP_LANDING_CALLS                     PropertyType = 470
	PROP_LANDING_CALL_CONTROL              PropertyType = 471
	PROP_LANDING_DOOR_STATUS               PropertyType = 472
	PROP_LOWER_DECK                        PropertyType = 473
	PROP_MACHINE_ROOM_ID                   PropertyType = 474
	PROP_MAKING_CAR_CALL                   PropertyType = 475
	PROP_NEXT_STOPPING_FLOOR               PropertyType = 476
	PROP_OPERATION_DIRECTION               PropertyType = 477
	PROP_PASSENGER_ALARM                   PropertyType = 478
	PROP_POWER_MODE                        PropertyType = 479
	PROP_REGISTERED_CAR_CALL               PropertyType = 480
	PROP_ACTIVE_COV_MULTIPLE_SUBSCRIPTIONS PropertyType = 481
	PROP_PROTOCOL_LEVEL                    PropertyType = 482
	PROP_REFERENCE_PORT                    PropertyType = 483
	PROP_DEPLOYED_PROFILE_LOCATION         PropertyType = 484
	PROP_PROFILE_LOCATION                  PropertyType = 485
	PROP_TAGS                              PropertyType = 486
	PROP_SUBORDINATE_NODE_btypes           PropertyType = 487
	PROP_SUBORDINATE_TAGS                  PropertyType = 488
	PROP_SUBORDINATE_RELATIONSHIPS         PropertyType = 489
	PROP_DEFAULT_SUBORDINATE_RELATIONSHIP  PropertyType = 490
	PROP_REPRESENTS                        PropertyType = 491

	/* The special property identifiers all  optional  and required  */
	/* are reserved for use in the ReadPropertyConditional and */
	/* ReadPropertyMultiple services or services not defined in this standard. */
	/* Enumerated values 0-511 are reserved for definition by ASHRAE.  */
	/* Enumerated values 512-4194303 may be used by others subject to the  */
	/* procedures and constraints described in Clause 23.  */
	/* do the max range inside of enum so that
	   compilers will allocate adequate sized datatype for enum
	   which is used to store decoding */

	MAX_BACNET_PROPERTY_ID PropertyType = 4194303
)

const (
	DescriptionStr = "Description"
	ObjectNameStr  = "ObjectName"
)

// propertyTypeMapping should be treated as read only.
var propertyTypeMapping = map[string]PropertyType{
	"AllProperties":    PropAllProperties,
	DescriptionStr:     PropDescription,
	"FileSize":         PropFileSize,
	"FileType":         PropFileType,
	"ModelName":        PropModelName,
	"ObjectIdentifier": PropObjectIdentifier,
	"ObjectList":       PropObjectList,
	ObjectNameStr:      PropObjectName,
	"ObjectReference":  PropObjectReference,
	"ObjectType":       PropObjectType,
	"PresentValue":     PropPresentValue,
	"Units":            PropUnits,
	"PriorityArray":    PropPriorityArray,
	// Kebab-case mappings for friendly use
	"present-value":     PropPresentValue,
	"units":             PropUnits,
	"priority-array":    PropPriorityArray,
	"status-flags":      PropStatusFlags,
	"polarity":          PropPolarity,
	"object-name":       PropObjectName,
	"object-list":       PropObjectList,
	"vendor-name":       PropVendorName,
	"model-name":        PropModelName,
	"system-status":     PropSystemStatus,
	"description":       PropDescription,
	"object-type":       PropObjectType,
	"object-identifier": PropObjectIdentifier,
}

// propertybtypestrMapping is a human readable printing of the priority
var propertybtypestrMapping = map[PropertyType]string{
	PropAllProperties:    "All Properties",
	PropDescription:      "Description",
	PropFileSize:         "File Size",
	PropFileType:         "File Type",
	PropModelName:        "Model Name",
	PropObjectIdentifier: "Object Identifier",
	PropObjectList:       "Object List",
	PropObjectName:       "Object Name",
	PropObjectReference:  "Object Reference",
	PropObjectType:       "Object Type",
	PropPresentValue:     "Present Value",
	PropUnits:            "PropUnits",
	PropPriorityArray:    "Priority Array",
}

// listOfKeys should be treated as read only after init
var listOfKeys []string

func init() {
	listOfKeys = make([]string, len(propertyTypeMapping))
	i := 0
	for k := range propertyTypeMapping {
		listOfKeys[i] = k
		i++
	}
}

func Keys() map[string]PropertyType {
	// A copy is made since we do not want outside packages editing our keys by
	// accident
	keys := make(map[string]PropertyType)
	for k, v := range propertyTypeMapping {
		keys[k] = v
	}
	return keys
}

func Get(s string) (PropertyType, error) {
	if v, ok := propertyTypeMapping[s]; ok {
		return v, nil
	}
	err := fmt.Errorf("%s is not a valid property.", s)
	return 0, err
}

// String returns a human readible string of the given property
func String(prop PropertyType) string {
	s, ok := propertybtypestrMapping[prop]
	if !ok {
		return "Unknown"
	}
	return fmt.Sprintf("%s (%d)", s, prop)
}

// The bool in the map doesn't actually matter since it won't be used.
var deviceProperties = map[PropertyType]bool{
	PropObjectList: true,
}

func IsDeviceProperty(id PropertyType) bool {
	_, ok := deviceProperties[id]
	return ok
}

type Property struct {
	Type       PropertyType
	ArrayIndex uint32
	Data       interface{}
	Priority   NPDUPriority
}

type PropertyData struct {
	InvokeID   uint16
	Object     Object
	ErrorClass uint8
	ErrorCode  uint8
}

type MultiplePropertyData struct {
	Objects    []Object
	ErrorClass uint8
	ErrorCode  uint8
}

// String returns a pretty print of the read multiple property structure
func (rp MultiplePropertyData) String() string {
	buff := bytes.Buffer{}
	spacing := strings.Repeat(" ", defaultSpacing)
	for _, obj := range rp.Objects {
		buff.WriteString(obj.ID.String())
		buff.WriteString("\n")
		for _, prop := range obj.Properties {
			buff.WriteString(spacing)
			buff.WriteString(String(prop.Type))
			buff.WriteString(fmt.Sprintf("[%v]", prop.ArrayIndex))
			buff.WriteString(": ")
			buff.WriteString(fmt.Sprintf("%v", prop.Data))
			buff.WriteString("\n")
		}
		buff.WriteString("\n")
	}
	return buff.String()
}

// PrintAllProperties prints all the properties within this package. This is only a
// subset of all properties.
func PrintAllProperties() {
	max := func(x map[string]PropertyType) int {
		max := 0
		for k, _ := range x {
			if len(k) > max {
				max = len(k)
			}
		}
		return max
	}(propertyTypeMapping)

	const numOfAdditionalSpaces = 15

	printRow := func(col1, col2 string, maxLen int) {
		spacing := strings.Repeat(" ", maxLen-len(col1)+numOfAdditionalSpaces)
		fmt.Printf("%s%s%s\n", col1, spacing, col2)
	}

	printRow("Key", "Int", max)
	fmt.Println(strings.Repeat("-", max+numOfAdditionalSpaces+6))

	for k, id := range propertyTypeMapping {
		// Spacing
		printRow(k, fmt.Sprintf("%d", id), max)
	}
}
