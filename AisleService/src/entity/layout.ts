// layout.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import Store from './store';

enum LAYOUT_TYPE {
    SHELF = 'SHELF',
    CASHIER = 'CASHIER',
    DOOR = 'DOOR'
}

@Entity('layout')
export default class Layout {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    pos_x!: number;

    @Column()
    pos_y!: number;

    @Column()
    row_span!: number;

    @Column()
    col_span!: number;

    @Column({
        type: 'enum',
        enum: LAYOUT_TYPE
    })
    type!: LAYOUT_TYPE;

    @ManyToOne(() => Store, store => store.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'store_id' })
    store!: Store;

    @Column()
    store_id!: number;
}

export interface ILayout {
    id: number;
    pos_x: number;
    pos_y: number;
    row_span: number;
    col_span: number;
    type: LAYOUT_TYPE;
    store: Store;
    store_id: number;
}
