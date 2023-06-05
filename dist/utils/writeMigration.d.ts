export default function writeMigration(currentState: any, migration: any, options: any): Promise<{
    filename: string;
    info: {
        revision: any;
        name: any;
        created: Date;
        comment: any;
    };
    revisionNumber: any;
}>;
