import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { SEED_ITEMS, SEED_LISTS, SEED_USERS } from './data/seed-data';
import { UsersService } from 'src/users/users.service';
import { ItemsService } from 'src/items/items.service';
import { ListsService } from 'src/lists/lists.service';
import { ListItemService } from 'src/list-item/list-item.service';
import { List } from 'src/lists/entities/list.entity';
import { ListItem } from 'src/list-item/entities/list-item.entity';

@Injectable()
export class SeedService {

    private isProd: boolean

    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(Item)
        private readonly itemRepository: Repository<Item>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly usersService: UsersService,
        private readonly itemsService: ItemsService,
        @InjectRepository(List)
        private readonly listsRepository: Repository<List>,
        private readonly listsService: ListsService,
        @InjectRepository(ListItem)
        private readonly listsItemsRepository: Repository<ListItem>,
        private readonly listsItemsService: ListItemService
    ) {
        this.isProd = configService.get('STATE') === 'prod';
    }

    async executeSeed() {

        if (this.isProd) {
            throw new UnauthorizedException('We cannot run SEED on Prod');
        }

        await this.deleteDatabase()

        const user = await this.loadUsers()

        await this.loadItems(user)

        const lists = await this.loadLists(user)

        const items = await this.itemsService.findAll(user, { limit: 15, offset: 0 }, {})
        await this.loadListItems(lists, items)

        return true
    }

    async deleteDatabase() {
        // Borrar ListItems
        await this.listsItemsRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute()

        // Borar Lists
        await this.listsRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute()

        // Borrar items
        await this.itemRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute()

        // Borrar users
        await this.userRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute()
    }

    async loadUsers(): Promise<User> {
        const users = []
        for (const user of SEED_USERS) {
            users.push(await this.usersService.create(user))
        }
        return users[0]
    }

    async loadItems(user: User): Promise<void> {
        const itemsPromises = []
        for (const item of SEED_ITEMS) {
            itemsPromises.push(this.itemsService.create(item, user))
        }
        await Promise.all(itemsPromises)
    }

    async loadLists(user: User): Promise<List> {
        const lists = []
        for (const list of SEED_LISTS) {
            lists.push(await this.listsService.create(list, user))
        }
        return lists[0]
    }

    async loadListItems(list: List, items: Item[]) {
        for (const item of items) {
            this.listsItemsService.create({
                quantity: Math.round(Math.random() * 10),
                completed: Math.round(Math.random() * 1) === 0 ? false : true,
                listId: list.id,
                itemId: item.id
            })
        }
    }
}
