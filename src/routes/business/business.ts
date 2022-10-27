import { client } from '@/utils';
import gql from 'graphql-tag';

const BUSINESS_QUERY = gql`
  query ($where: busines_bool_exp) {
    busines(where: $where, limit: 30, order_by: { owner: asc }) {
      id
      en
      lo
      code
      owner
      gender
      phone
      phone2
      certificateNo: certificate_no
      loans (where: {
        trash: { _eq: false }
      }){
        title
        contractDate:contract_date
        contractEnd:contract_end
        amount
        loan_amount_approved
        trash
        grade
        bank_branch {
          name
          bank {
            lo
            en
            logo
          }
        }
        loanStatus: loan_status {
          id
          lo
          en
          active
        }
      }
      busines_type {
        lo
        en
      }
      village {
        lo
        en
        district {
          lo
          en
          province {
            lo
            en
          }
        }
      }
    }
  }
`;

export const getBusiness = async (variables?: any) => {
  try {
    const { busines } = await client.request(BUSINESS_QUERY, variables);
    return [null, busines];
  } catch (error) {
    return [error];
  }
};
