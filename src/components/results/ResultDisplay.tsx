
import ProgressDemo from "@/components/ui/Progress"
type Props={
    yesTotal : number;
    noTotal: number;
}

export function ResultDisplay(props: Props){
   
    return (
        <div className="text-gray-900">
            <div>
                <div className="rounded-full">
                    Yes Votes: {props.yesTotal} <br />
                </div>
                <ProgressDemo value = {props.yesTotal} max = {props.yesTotal + props.noTotal}/>
            </div>
            <div>
                <div className="rounded-full">
                    No Votes: {props.noTotal}
                </div>
                <ProgressDemo value = {props.noTotal} max = {props.yesTotal + props.noTotal}/>
            </div> 
        </div>
    )
    
}

