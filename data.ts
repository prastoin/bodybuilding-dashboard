import { faker } from "@faker-js/faker";
import { Program } from "./types";

const getUuid = () => faker.string.uuid()
export const myStaticProgram: Program = {
    name: "prastoin's program",
    sessionList: [
        {
            name: "Bench press day",
            uuid: getUuid(),
            exerciseList: [
                {
                    name: "Bench press barbell",
                    load: 80,
                    rep: 8,
                    rest: 230,
                    set: 4,
                    uuid: getUuid()
                },
                {
                    name: "Vertical pulldown",
                    load: 70,
                    rep: 8,
                    rest: 230,
                    set: 4,
                    uuid: getUuid()
                },
                {
                    name: "Leg extension",
                    load: 70,
                    rep: 8,
                    rest: 230,
                    set: 4,
                    uuid: getUuid()
                },
                {
                    name: "Lateral raises cable",
                    load: 5,
                    rep: 10,
                    rest: 130,
                    set: 4,
                    uuid: getUuid()
                },
                {
                    name: "Biceps curl db",
                    load: 12,
                    rep: 8,
                    rest: 200,
                    set: 4,
                    uuid: getUuid()
                },
            ]
        },
        {
            name: "Squat day",
            uuid: getUuid(),
            exerciseList: [
                {
                    name: "Squat barbell",
                    load: 80,
                    rep: 8,
                    rest: 230,
                    set: 4,
                    uuid: getUuid()
                },
                {
                    name: "Overhead press machine",
                    load: 50,
                    rep: 8,
                    rest: 230,
                    set: 4,
                    uuid: getUuid()
                },
                {
                    name: "Rear delt cable",
                    load: 5,
                    rep: 10,
                    rest: 130,
                    set: 4,
                    uuid: getUuid()
                },
                {
                    name: "Assisted pullups",
                    load: -21,
                    rep: 6,
                    rest: 200,
                    set: 4,
                    uuid: getUuid()
                },
                {
                    name: "Biceps curl barbell",
                    load: 33,
                    rep: 8,
                    rest: 200,
                    set: 4,
                    uuid: getUuid()
                },
            ]
        },
        {
            name: "Low row day",
            uuid: getUuid(),
            exerciseList: [
                {
                    name: "Low row machine 1 by 1",
                    load: 40,
                    rep: 8,
                    rest: 130,
                    set: 4,
                    uuid: getUuid()
                },
                {
                    name: "Incline dumbell bench press",
                    load: 32,
                    rep: 8,
                    rest: 230,
                    set: 4,
                    uuid: getUuid()
                },
                {
                    name: "Cable Y",
                    load: 3.75,
                    rep: 10,
                    rest: 130,
                    set: 4,
                    uuid: getUuid()
                },
                {
                    name: "Triceps ropes",
                    load: 17.5,
                    rep: 8,
                    rest: 200,
                    set: 4,
                    uuid: getUuid()
                },
                {
                    name: "Calves raises",
                    load: 60,
                    rep: 8,
                    rest: 200,
                    set: 4,
                    uuid: getUuid()
                },
            ]
        },
        {
            name: "Conventional Deadlift day",
            uuid: getUuid(),
            exerciseList: [
                {
                    name: "Conventional Deadlift day",
                    load: 110,
                    rep: 8,
                    rest: 230,
                    set: 4,
                    uuid: getUuid()
                },
                {
                    name: "Leg curl",
                    load: 40,
                    rep: 8,
                    rest: 200,
                    set: 4,
                    uuid: getUuid()
                },
                {
                    name: "Trieps barbell",
                    load: 25,
                    rep: 8,
                    rest: 200,
                    set: 4,
                    uuid: getUuid()
                },
                {
                    name: "Butterfly",
                    load: 60,
                    rep: 8,
                    rest: 200,
                    set: 4,
                    uuid: getUuid()
                },
            ]
        },
    ],
    uuid: "42"
}