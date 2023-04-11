
<h2>Task 4.1</h2>

<h3>Script for loading data.</h3>

aws dynamodb batch-write-item \
    --request-items file://products.json

aws dynamodb batch-write-item \
    --request-items file://stock.json

<h2>Task 4.2</h2>
