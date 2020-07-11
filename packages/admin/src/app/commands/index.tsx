import React from "react";
import { useSocket } from "../../hooks/useSocket";
import { Command } from "./Command";
import { CreateNewCommand } from "./CreateNew";

enum FetchCommandActionTypes {
  FETCH_INIT = "FETCH_INIT",
  FETCH_SUCCESS = "FETCH_SUCCESS",
  FETCH_ERROR = "FETCH_ERROR"
}

enum CommandEventActionTypes {
  COMMAND_CREATED = "COMMAND_CREATED",
  COMMAND_DELETED = "COMMAND_DELETED",
  COMMAND_UPDATED = "COMMAND_UPDATED"
}

interface CommandAction<T = any> {
  type: FetchCommandActionTypes | CommandEventActionTypes;
  payload?: T;
}

interface CommandState {
  loading: boolean;
  error: any;
  data: ICommand[] | null;
}

interface ICommand {
  id: number;
  command: string;
  response: string;
}

const initialState: CommandState = {
  loading: false,
  error: null,
  data: null
};

const reducer = (state: CommandState, action: CommandAction) => {
  console.log({ action });
  switch (action.type) {
    case FetchCommandActionTypes.FETCH_INIT: {
      return {
        loading: true,
        error: null,
        data: null
      };
    }
    case FetchCommandActionTypes.FETCH_SUCCESS: {
      return {
        loading: false,
        error: null,
        data: action.payload
      };
    }
    case FetchCommandActionTypes.FETCH_ERROR: {
      return {
        loading: false,
        error: action.payload,
        data: null
      };
    }
    case CommandEventActionTypes.COMMAND_CREATED: {
      return {
        ...state,
        data: [...state.data, action.payload]
      };
    }
    case CommandEventActionTypes.COMMAND_UPDATED: {
      return {
        ...state,
        data: state.data.map(command =>
          command.id.toString() === action.payload.id ? action.payload : command
        )
      };
    }
    case CommandEventActionTypes.COMMAND_DELETED: {
      return {
        ...state,
        data: state.data.filter(
          command => command.id.toString() !== action.payload
        )
      };
    }
    default: {
      return state;
    }
  }
};

export const Commands = () => {
  const socket = useSocket();
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [shouldFetch, setShouldFetch] = React.useState(true);

  React.useEffect(() => {
    socket.on("command-created", (data: ICommand) => {
      console.log({ commandCreated: data });
      dispatch({
        type: CommandEventActionTypes.COMMAND_CREATED,
        payload: data
      });
    });

    socket.on("command-updated", (data: ICommand) => {
      dispatch({
        type: CommandEventActionTypes.COMMAND_UPDATED,
        payload: data
      });
    });

    socket.on("command-deleted", (id: number) => {
      dispatch({ type: CommandEventActionTypes.COMMAND_DELETED, payload: id });
    });

    return () => socket.close();
  }, []);

  React.useEffect(() => {
    if (shouldFetch) {
      setShouldFetch(false);
      dispatch({ type: FetchCommandActionTypes.FETCH_INIT });
      fetch("http://localhost:4040/commands")
        .then(res => res.json())
        .then(res => {
          dispatch({
            type: FetchCommandActionTypes.FETCH_SUCCESS,
            payload: res
          });
        })
        .catch(err => {
          dispatch({ type: FetchCommandActionTypes.FETCH_ERROR, payload: err });
        });
    }
  }, [shouldFetch]);

  return (
    <div>
      <h1 className="text-indigo-600">Commands</h1>
      <button
        type="button"
        onClick={() => setShouldFetch(true)}
        disabled={shouldFetch || state.loading}
      >
        Refresh
      </button>

      {!state.data ? (
        <div>
          <p>Looks like there isn't data yet...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {state.data.map(command => {
            return <Command command={command} key={command.id} />;
          })}
        </div>
      )}
      <CreateNewCommand />
    </div>
  );
};