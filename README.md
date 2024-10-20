# DDB-FieldLevel-Encryption

In this application, AWS Key Management Service (KMS) is used for encryption. Specifically, it performs client-side encryption by encrypting sensitive data fields before storing them in DynamoDB. Here’s an explanation of the encryption used and an overview of other encryption methods available in AWS.

## Encryption Used in the Code
### Client-Side Encryption with AWS KMS:

In the example, sensitive data is encrypted using the AWS KMS service before being stored in the DynamoDB table.

The EncryptCommand of the AWS SDK for KMS is used to encrypt data on the client side (within the Lambda function) using a KMS Customer Master Key (CMK).

The encrypted data is stored in DynamoDB as a binary field.

To retrieve the original data, the DecryptCommand is used to decrypt the encrypted value.

## How KMS Works in This Case:

### KMS Key (CMK): 
The example creates a KMS key, which is used for both encryption and decryption operations. This key is managed by KMS and can be configured for automatic key rotation.

### Envelope Encryption: 
KMS is often used for envelope encryption, where data is encrypted with a data encryption key (DEK), and the DEK itself is encrypted using the CMK.

### Access Control: 
Permissions for using the KMS key can be managed through IAM policies, providing fine-grained access control.

## Different Types of AWS Encryption
AWS offers multiple encryption methods to secure data at rest and in transit. Here’s an overview:

## 1. Server-Side Encryption (SSE)
### SSE-S3 (Server-Side Encryption with Amazon S3-Managed Keys):
Uses Amazon S3 to manage encryption keys.
Data is encrypted before being stored and automatically decrypted when accessed.
No need to manage encryption keys yourself.

### SSE-KMS (Server-Side Encryption with KMS-Managed Keys):
Uses AWS KMS to manage encryption keys.
Provides additional security controls like key rotation, access policies, and audit logs.
Ideal for scenarios where compliance requirements dictate using KMS.

### SSE-C (Server-Side Encryption with Customer-Provided Keys):
Allows users to provide their own encryption keys.
AWS does not store the keys, and they must be provided with each request.
## 2. Client-Side Encryption
### Client-Side Encryption with KMS (as demonstrated in the code above):
Data is encrypted before it is sent to AWS services like S3 or DynamoDB.
Uses a KMS-managed key for encryption operations.
### Client-Side Encryption with a Custom Key:
Users can implement their own encryption mechanisms (e.g., using a custom encryption library).
AWS services store only the encrypted data, and decryption must be handled client-side.
## 3. AWS Key Management Service (KMS)
### Customer Managed Keys (CMKs):
Users create and manage their own KMS keys.
Provides fine-grained permissions, key rotation, and key policy management.
### AWS Managed Keys:
AWS automatically creates and manages these keys.
Typically used for default encryption in services like S3 and RDS.
Automatic Key Rotation:
KMS supports automatic key rotation for CMKs, helping meet compliance requirements.
### Envelope Encryption:
KMS can be used for envelope encryption, where a data encryption key is used to encrypt the data, and KMS is used to encrypt the data key.
## 4. Encryption at Rest vs. In Transit
### Encryption at Rest:
Data is encrypted while stored (e.g., on disk or in a database).
AWS services like S3, RDS, and DynamoDB offer built-in encryption at rest.
Supports key management using AWS KMS or service-managed keys.
### Encryption in Transit:
Data is encrypted while being transmitted (e.g., using HTTPS/TLS).
Ensures secure communication between clients and AWS services.
Many AWS services enforce encryption in transit by default (e.g., S3, API Gateway).

## Use Cases for Different Encryption Methods
### Data Protection and Compliance:
Use AWS KMS for fine-grained access control and audit logging to meet compliance requirements (e.g., HIPAA, GDPR).
### Storage Services (S3, EBS, RDS):
Employ server-side encryption with KMS (SSE-KMS) for sensitive data.
### Custom Applications:
Implement client-side encryption when data needs to be encrypted before it is sent to AWS.
### Network Security:
Use encryption in transit (e.g., HTTPS/TLS) to secure data transmission between clients and AWS services.
## Summary
AWS KMS provides a flexible way to manage encryption keys and perform encryption operations.
Client-side encryption gives more control over data security but requires handling encryption and decryption in the application.
Server-side encryption simplifies encryption management but relies on AWS services to handle the encryption process.
AWS encryption options enable secure data handling across various scenarios, ensuring data privacy and meeting regulatory requirements.
