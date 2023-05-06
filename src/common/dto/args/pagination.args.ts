import { ArgsType, Field, Int } from "@nestjs/graphql"
import { IsOptional, Min } from "class-validator"

@ArgsType()
export class PaginationArgs {
    @IsOptional()
    @Min(0)
    @Field(() => Int, { nullable: true })
    offset: number = 0

    @IsOptional()
    @Min(1)
    @Field(() => Int, { nullable: true })
    limit: number = 10
}