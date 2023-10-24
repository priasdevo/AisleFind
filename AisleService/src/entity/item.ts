// item.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import Layout from './layout';
import Store from './store';

@Entity('item')
export default class Item {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column({ default: '' })
    description?: string;

    @Column({ default: 0 })
    search_count!: number;

    @ManyToOne(() => Layout, layout => layout.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'layout_id' })
    layout!: Layout;

    @Column()
    layout_id!: number;

    @ManyToOne(() => Store, store => store.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'store_id' })
    store!: Store;

    @Column()
    store_id!: number;
}

export interface IItem {
    id: number;
    title: string;
    description?: string;
    search_count: number;
    layout: Layout;
    layout_id: number;
    store: Store;
    store_id: number;
}
