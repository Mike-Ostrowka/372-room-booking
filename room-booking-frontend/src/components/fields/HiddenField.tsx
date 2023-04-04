import { Stack, Text, Textarea } from "@chakra-ui/react";

interface HiddenFieldProps {
  isHidden: boolean;
  issues: string;
  setIssues: any;
}


export const HiddenField = ({ isHidden, issues, setIssues }: HiddenFieldProps) => {
    return isHidden ? null : (
      <Stack>
        <Text mb="8px">What was wrong with this room?</Text>
        <Textarea
          placeholder="Enter the room issues"
          size="lg"
          name="issueText"
          value={issues}
          onChange={(e) => {
            setIssues(e.target.value);
          }}
        />
      </Stack>
    );
}

export default HiddenField;