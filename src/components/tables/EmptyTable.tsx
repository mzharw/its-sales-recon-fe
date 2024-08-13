import {IconMoodConfuzed} from "@tabler/icons-react";

export default function EmptyTable() {
    return (
        <div className="flex flex-row justify-center text-neutral-400 py-5 gap-3 mr-10 items-center w-full">
            <IconMoodConfuzed size={100} className="text-neutral-300"/>
            <span className="text-xl font-light">
            <p className='font-bold'>There is nothing here</p>
            <small>maybe try to create a new one?</small>
            </span>
        </div>
    )
}