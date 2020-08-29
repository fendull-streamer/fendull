import boto3
import os
from cf_invalidate import perform_invalidation

BUCKET_POLICY = """{"Version": "2012-10-17","Statement": [{"Sid": "PublicReadGetObject","Effect": "Allow","Principal": "*","Action": "s3:GetObject","Resource": "arn:aws:s3:::freedom-generator/*"}]}"""
BUCKET_NAME = 'fendull-website'
DOMAIN_NAME = "fendull.com"

s3_client = boto3.client('s3')
s3 = boto3.resource('s3')
b = s3.Bucket(BUCKET_NAME)

if b.creation_date is None:
    print('S3 Bucket does not exist: creating a new one.')
    b.create()
    bp = s3.BucketPolicy(BUCKET_NAME)
    bp.put(ConfirmRemoveSelfBucketAccess=False, Policy=BUCKET_POLICY)
    bw = s3.BucketWebsite(BUCKET_NAME)
    bw.put(WebsiteConfiguration={
        'ErrorDocument': {
            'Key': 'index.html'
        },
        'IndexDocument': {
            'Suffix': 'index.html'
        }
    })
print('Emptying S3 Bucket...')
b.objects.all().delete()

print('Uploading build directory to S3...')
for root, directories, filenames in os.walk('../web/build'):
    for filename in filenames:
        f = os.path.join(root, filename)
        if 'html' in f:
            g = open(f, 'rb')
            b.put_object(Body=g.read(), Key=f.replace('\\', '/').replace('../web/build/',''), ContentType='text/html')
            g.close()
        elif 'css' in f:
            g = open(f, 'rb')
            b.put_object(Body=g.read(), Key=f.replace('\\', '/').replace('../web/build/',''), ContentType='text/css')
            g.close()
        else:
            b.upload_file(f, f.replace('\\', '/').replace('../web/build/',''))
            
perform_invalidation(DOMAIN_NAME)
print('Web is now hosted at http://{}.s3-website-us-east-1.amazonaws.com/'.format(BUCKET_NAME))