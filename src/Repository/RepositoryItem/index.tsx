import gql from 'graphql-tag';
import React from 'react';
import { useMutation } from 'react-apollo';
import Button from '../../Button';
import Link from '../../Link';
import REPOSITORY_FRAGMENT from '../fragments';
import '../style.css';

const STAR_REPOSITORY = gql`
  mutation($id: ID!) {
    addStar(input: { starrableId: $id }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

const UNSTAR_REPOSITORY = gql`
  mutation($id: ID!) {
    removeStar(input: { starrableId: $is }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

const WATCH_REPOSITORY = gql`
  mutation($id: ID!, $viewerSubscription: SubscriptionState!) {
    updateSubscription(
      input: { state: $viewerSubscription, subscribableId: $id }
    ) {
      subscribable {
        id
        viewerSubscription
      }
    }
  }
`;

const VIEWER_SUBSCRIPTIONS = {
  SUBSCRIBED: 'SUBSCRIBED',
  UNSUBSCRIBED: 'UNSUBSCRIBED',
};

const isWatch = (viewerSubscription: string) => {
  return viewerSubscription === VIEWER_SUBSCRIPTIONS.SUBSCRIBED;
};

interface IUpdateWatchData {
  data: {
    updateSubscription: {
      subscribable: {
        id: any;
        viewerSubscription: any;
      }
    }
  }
}

const updateWatch = (
  client: any,
  {
    data: {
      updateSubscription: {
        subscribable: { id, viewerSubscription },
      },
    },
  }: IUpdateWatchData,
) => {
  const repository = client.readFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
  });

  let { totalCount } = repository.watchers;
  totalCount =
    viewerSubscription === VIEWER_SUBSCRIPTIONS.SUBSCRIBED
      ? totalCount + 1
      : totalCount - 1;

  client.writeFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
    data: {
      ...repository,
      watchers: {
        ...repository.watchers,
        totalCount,
      },
    },
  });
};

interface IUpdateAddStarData {
  data: {
    addStar: {
      starrable: {
        id: any;
      }
    }
  }
}

const updateAddStar = (
  client: any,
  { data: { addStar: { starrable: { id } } } }: IUpdateAddStarData
) => {
  const repository = client.readFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
  });

  const totalCount = repository.stargazers.totalCount + 1;

  client.writeFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
    data: {
      ...repository,
      stargazers: {
        ...repository.stargazers,
        totalCount,
      },
    },
  });
};

interface IRepositoryItemProps {
  id: string;
  name: string;
  url: string;
  descriptionHTML: string;
  primaryLanguage: {
    name: string,
  };
  owner: {
    url: string,
    login: string,
  };
  stargazers: {
    totalCount: number;
  }
  watchers: {
    totalCount: number;
  };
  viewerSubscription: string;
  viewerHasStarred: boolean;
}

const RepositoryItem = ({
  id,
  name,
  url,
  descriptionHTML,
  primaryLanguage,
  owner,
  stargazers,
  watchers,
  viewerSubscription,
  viewerHasStarred,
}: IRepositoryItemProps) => {

  // @ts-ignore
  const [updateSubscription] = useMutation(WATCH_REPOSITORY, {
    variables: {
      id,
      viewerSubscription: isWatch(viewerSubscription)
        ? VIEWER_SUBSCRIPTIONS.UNSUBSCRIBED
        : VIEWER_SUBSCRIPTIONS.SUBSCRIBED,
    },
    optimisticResponse: {
      updateSubscription: {
        __typename: 'Mutation',
        starrable: {
          __typename: 'Repository',
          id
        },
      },
    },
    update: updateWatch,
  });
  // @ts-ignore
  const [addStar] = useMutation(STAR_REPOSITORY, {
    variables: {
      id,
    },
    optimisticResponse: {
      addStar: {
        __typename: 'Mutation',
        subscribable: {
          __typename: 'Repository',
          id,
          viewerSubscription: isWatch(viewerSubscription)
            ? VIEWER_SUBSCRIPTIONS.SUBSCRIBED
            : VIEWER_SUBSCRIPTIONS.UNSUBSCRIBED,
        },
      },
    },
    update: updateAddStar,
  });

  return (
    <div>
      <div className="RepositoryItem-title">
        <h2>
          <Link href={url}>{name}</Link>
        </h2>

        <div className="RepositoryItem-title-action">
          <Button
            className="RepositoryItem-title-action"
            onClick={updateSubscription}
          >
            {watchers.totalCount}{' '}
            {isWatch(viewerSubscription) ? 'Unwatch' : 'Watch'}
          </Button>

          {!viewerHasStarred ? (
            <Button
              className={'RepositoryItem-title-action'}
              onClick={addStar}
            >
              {stargazers.totalCount} Star
              </Button>
          ) : (
              <span>{/* remove star mutation */}</span>
            )}
        </div>
      </div>

      <div className="RepositoryItem-description">
        <div
          className="RepositoryItem-description-info"
          dangerouslySetInnerHTML={{ __html: descriptionHTML }}
        />
        <div className="RepositoryItem-description-details">
          <div>
            {primaryLanguage && (
              <span>Language: {primaryLanguage.name}</span>
            )}
          </div>
          <div>
            {owner && (
              <span>
                Owner: <a href={owner.url}>{owner.login}</a>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
};

export default RepositoryItem;
