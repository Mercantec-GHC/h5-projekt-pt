### Webshop - PT Market

## Techstack

- Docker for automatic deployment
- Nextjs for frontend
- rabbitmq as message broker
- Debian 12 as server with mysql

## Requirements

- As a User I should be able to browser a multitude of products
- As a User I should be able to purchase a chosen product
- As a User I should be able to buy a specific amount of a chosen product
- As a User I should be able to buy multiple products at once
- As a User I should be able to scan my “card”
- As a User I should be able to search up a product(s)
- As a User I should be able to use different type of filters for listed products
- As a User i should get a confirmation email on a completed purchase

## Use case

When I need a new table, a new phone, a cool car, I will be able to log in to PT Market. Here I will be able to see a number of products. There will be the option to add x number of items to the cart.

When I am finished finding the products I want to buy, I should be able to pay with a debit or credit card.

## Arduino

- RFID RC522
- [Guide in description](https://ardustore.dk/produkt/rfid-rc522-reader-writer-13-56-mhz-spi-module)
- [video1](https://www.youtube.com/watch?v=cFK87MJ96A8)
- [video2](https://youtu.be/aIO6KdzITzU?si=xKEuIvxoSbHy9tDr)
- [Guide with steps](https://www.instructables.com/Arduino-MFRC522-RFID-READER/)


## Setup
Remove .example from env files
Run docker compose up --build -d
All services should now be running and you should be able to find the webshop at localhost:8080
