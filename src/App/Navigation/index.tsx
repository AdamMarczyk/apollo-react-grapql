import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import Button from '../../Button';
import * as routes from '../../constants/routes';
import Input from '../../Input';
import './style.css';

interface INavigationProps {
  location: {
    pathname: string
  };
  organizationName: string;
  onOrganizationSearch: (value: string) => {};
}

const Navigation = ({
  location: { pathname },
  organizationName,
  onOrganizationSearch,
}: INavigationProps & any) => (
    <header className="Navigation">
      <div className="Navigation-link">
        <Link to={routes.PROFILE}>Profile</Link>
      </div>
      <div className="Navigation-link">
        <Link to={routes.ORGANIZATION}>Organization</Link>
      </div>

      {pathname === routes.ORGANIZATION && (
        <OrganizationSearch
          organizationName={organizationName}
          onOrganizationSearch={onOrganizationSearch}
        />
      )}
    </header>
  );

interface IOrganizationSearchProps {
  organizationName: string;
  onOrganizationSearch: (value: string) => {};
}

const OrganizationSearch = (props: IOrganizationSearchProps) => {
  const [value, setValue] = React.useState(props.organizationName)

  const onChange = (event: any) => {
    setValue(event.target.value);
  };

  const onSubmit = (event: any) => {
    props.onOrganizationSearch(value);

    event.preventDefault();
  };

  return (
    <div className="Navigation-search">
      <form onSubmit={onSubmit}>
        <Input
          children={null}
          color={'white'}
          type="text"
          value={value}
          onChange={onChange}
        />{' '}
        <Button color={'white'} type="submit" className="">
          Search
        </Button>
      </form>
    </div>
  );
}


export default withRouter(Navigation);
