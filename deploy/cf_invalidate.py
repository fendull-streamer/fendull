import boto3
import time

def get_distribution(domain):
    cf_client = boto3.client('cloudfront')
    result = cf_client.list_distributions()['DistributionList']['Items']
    for distribution in result:
        if distribution['Aliases']['Items'][0] == domain:
            return distribution


def perform_invalidation(domain):
    distribution = get_distribution(domain)
    cf_client = boto3.client('cloudfront')
    response = cf_client.create_invalidation(
        DistributionId=distribution['Id'],
        InvalidationBatch={
            'Paths': {
                'Quantity': 1,
                'Items': [
                    '/',
                ]
            },
            'CallerReference': str(time.time())
        }
    )