// Import the default document actions
import defaultResolve, {
  CreateAction,
  DeleteAction,
  DuplicateAction,
  UnpublishAction
} from "part:@sanity/base/document-actions";

const DoNothingAction = () => null;

// Remove certain Document Actions from the menu, for specific document types
// See: https://www.sanity.io/docs/document-actions
// (`__experimental_actions` is deprecated: https://www.sanity.io/docs/ui-affordances-for-actions)

export default function resolveDocumentActions(props) {
  return defaultResolve(props).map(Action => {
    const types = ["homePage"];
    const disallowedActions = [CreateAction, DeleteAction, DuplicateAction, UnpublishAction];
    return types.includes[props.type] && disallowedActions.includes(Action)
      ? DoNothingAction
      : Action;
  });
}
