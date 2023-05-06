import { ArgsType, Field } from "@nestjs/graphql";
import { IsOptional, IsString } from "class-validator";

@ArgsType()
export class SearchArgs {
    @IsString()
    @IsOptional()
    @Field(() => String, { nullable: true })
    search?: string
}