import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export default class Item {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column({ default: '' })
    description?: string;

    @Column({ default: 0 })
    search_count?: number;

    @Column()
    layout_id!: number;

    @Column()
    store_id!: number;
}

export interface IItem {
    id: number,
    title: string,
    description?: string,
    searchCount?: number,
    layout_id: string
}