all:
	@docker compose up --build

prod:
	@docker compose -f compose.prod.yaml up --build

detach:
	@docker compose up --build -d

down:
	@docker compose down

fdown:
	@docker compose down --volumes

migrate:
	@docker exec -it backend python manage.py migrate

createsuperuser:
	@docker exec -it backend python manage.py createsuperuser

rebuild: down all

watch:
	@docker compose up --watch

clean: down
	@docker system prune -a

fclean: down
	@docker system prune -f -a --volumes

.PHONY: all prod detach down fdown migrate createsuperuser rebuild watch clean fclean
