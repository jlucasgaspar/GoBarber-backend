import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export default class AddCreatedAtAndUpdatedAtToAppointments1608502213828 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.addColumn(
			'appointments',
			new TableColumn({
				name: 'created_at',
				type: 'timestamp',
				default: 'now()'
			})
		)

		await queryRunner.addColumn(
			'appointments',
			new TableColumn({
				name: 'updated_at',
				type: 'timestamp',
				default: 'now()'
			})
		)
   }

   public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropColumn('appointments', 'created_at')
		await queryRunner.dropColumn('appointments', 'updated_at')
   }

}
