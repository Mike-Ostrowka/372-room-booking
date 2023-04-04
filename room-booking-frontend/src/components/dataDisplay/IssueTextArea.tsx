import { Textarea } from "@chakra-ui/react"


const IssueTextArea = (props: {issue?: any}) => {
    return props.issue ? (
        <Textarea value={props.issue} readOnly={true}/>
    ): null;
}

export default IssueTextArea;